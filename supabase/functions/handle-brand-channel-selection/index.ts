import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse form data from SPOC's brand channel selection
    const formData = await req.formData()
    const partnerId = formData.get('partnerId') as string
    const brandChannelValue = formData.get('brandChannel') as string

    if (!partnerId || !brandChannelValue) {
      throw new Error('Missing partnerId or brandChannel')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get brand channel name from mapping
    const { data: brandChannelMapping, error: mappingError } = await supabase
      .from('brand_channel_mappings')
      .select('brand_channel')
      .eq('numeric_value', parseInt(brandChannelValue))
      .single()

    if (mappingError || !brandChannelMapping) {
      throw new Error('Invalid brand channel selection')
    }

    // Update partner with selected brand channel
    const { error: updateError } = await supabase
      .from('partners')
      .update({ 
        brand_channel: brandChannelMapping.brand_channel,
        status: 'bos-processing' // Move to next stage
      })
      .eq('id', partnerId)

    if (updateError) {
      throw new Error(`Failed to update partner: ${updateError.message}`)
    }

    // Update milestone - mark "In Review" as in-progress
    const { error: milestoneError } = await supabase
      .from('milestones')
      .update({
        status: 'in-progress',
        started_at: new Date().toISOString()
      })
      .eq('partner_id', partnerId)
      .eq('name', 'In Review')

    if (milestoneError) {
      console.warn('Failed to update milestone:', milestoneError.message)
    }

    // Log the selection
    await supabase.from('email_logs').insert({
      partner_id: partnerId,
      email_type: 'spoc_brand_channel_response',
      metadata: { 
        selected_brand_channel: brandChannelMapping.brand_channel,
        numeric_value: brandChannelValue 
      },
      sent_at: new Date().toISOString()
    })

    console.log(`SPOC selected brand channel "${brandChannelMapping.brand_channel}" for partner ${partnerId}`)

    // Return success page
    const successHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Brand Channel Selection Confirmed</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          .success { color: #28a745; font-size: 24px; margin-bottom: 20px; }
          .details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px auto; max-width: 500px; }
        </style>
      </head>
      <body>
        <div class="success">✅ Brand Channel Selection Confirmed</div>
        <div class="details">
          <h3>Selection Details:</h3>
          <p><strong>Partner ID:</strong> ${partnerId}</p>
          <p><strong>Selected Brand Channel:</strong> ${brandChannelMapping.brand_channel}</p>
          <p><strong>Status:</strong> Updated successfully</p>
        </div>
        <p>Thank you! The partner has been moved to the next stage of processing.</p>
        <p><em>You can close this window.</em></p>
      </body>
      </html>
    `

    return new Response(successHtml, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html' },
      status: 200,
    })

  } catch (error) {
    console.error('Error handling brand channel selection:', error)
    
    const errorHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          .error { color: #dc3545; font-size: 24px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="error">❌ Error Processing Selection</div>
        <p>There was an error processing your brand channel selection.</p>
        <p>Please contact support or try again.</p>
        <p><strong>Error:</strong> ${error.message}</p>
      </body>
      </html>
    `

    return new Response(errorHtml, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html' },
      status: 500,
    })
  }
})
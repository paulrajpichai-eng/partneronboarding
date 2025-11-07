import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  spocEmail: string
  spocName: string
  partnerName: string
  partnerId: string
  partnerDetails: any
  brandChannelOptions: Array<{
    numericValue: number
    brandChannel: string
  }>
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { spocEmail, spocName, partnerName, partnerId, partnerDetails, brandChannelOptions }: EmailRequest = await req.json()

    // Generate email HTML content
    const emailHtml = generateEmailContent({
      spocName,
      spocEmail,
      partnerName,
      partnerId,
      partnerDetails,
      brandChannelOptions
    })

    // In a real implementation, you would integrate with an email service here
    // For example, using Resend, SendGrid, or AWS SES
    
    // Example with Resend (you would need to add Resend API key to environment variables)
    /*
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured')
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@uncoded.com',
        to: [spocEmail],
        subject: `Brand channel needed for the partner – ${partnerName}`,
        html: emailHtml,
      }),
    })

    if (!emailResponse.ok) {
      const error = await emailResponse.text()
      throw new Error(`Failed to send email: ${error}`)
    }
    */

    // For now, we'll simulate sending and log the email
    console.log('=== SPOC EMAIL SENT ===')
    console.log('To:', spocEmail)
    console.log('Subject:', `Brand channel needed for the partner – ${partnerName}`)
    console.log('Partner ID:', partnerId)
    console.log('========================')

    // You can also store the email in a database table for tracking
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Store email log (optional)
    await supabase.from('email_logs').insert({
      recipient: spocEmail,
      subject: `Brand channel needed for the partner – ${partnerName}`,
      partner_id: partnerId,
      email_type: 'spoc_brand_channel_request',
      sent_at: new Date().toISOString()
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        partnerId 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

function generateEmailContent(emailData: {
  spocName: string
  spocEmail: string
  partnerName: string
  partnerId: string
  partnerDetails: any
  brandChannelOptions: Array<{
    numericValue: number
    brandChannel: string
  }>
}): string {
  const brandChannelOptions = emailData.brandChannelOptions
    .map(option => `<option value="${option.numericValue}">${option.brandChannel}</option>`)
    .join('')

  const callbackUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/handle-brand-channel-selection`

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .partner-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .form-section { background: white; padding: 20px; border-radius: 5px; margin: 15px 0; }
        .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
        .form-group { margin: 15px 0; }
        label { font-weight: bold; display: block; margin-bottom: 5px; }
        select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Brand Channel Selection Required</h1>
          <p>Hello ${emailData.spocName},</p>
        </div>
        
        <div class="content">
          <p>A new partner <strong>${emailData.partnerName}</strong> has registered and requires brand channel assignment.</p>
          
          <div class="partner-details">
            <h3>Partner Details:</h3>
            <p><strong>Partner ID:</strong> ${emailData.partnerId}</p>
            <p><strong>Owner Name:</strong> ${emailData.partnerDetails.ownerName}</p>
            <p><strong>Firm Name:</strong> ${emailData.partnerDetails.firmName}</p>
            <p><strong>Email:</strong> ${emailData.partnerDetails.email}</p>
            <p><strong>Mobile:</strong> ${emailData.partnerDetails.mobile}</p>
            <p><strong>Country:</strong> ${emailData.partnerDetails.country}</p>
            <p><strong>Brand:</strong> ${emailData.partnerDetails.brand}</p>
            <p><strong>Business Type:</strong> ${emailData.partnerDetails.business}</p>
            <p><strong>Address:</strong> ${emailData.partnerDetails.address}, ${emailData.partnerDetails.city}, ${emailData.partnerDetails.state} - ${emailData.partnerDetails.pinCode}</p>
          </div>
          
          <div class="form-section">
            <h3>Please Select Brand Channel:</h3>
            <form action="${callbackUrl}" method="POST">
              <input type="hidden" name="partnerId" value="${emailData.partnerId}">
              <div class="form-group">
                <label for="brandChannel">Brand Channel:</label>
                <select name="brandChannel" id="brandChannel" required>
                  <option value="">Select Brand Channel</option>
                  ${brandChannelOptions}
                </select>
              </div>
              <button type="submit" class="button">Submit Brand Channel Selection</button>
            </form>
          </div>
          
          <p><em>Please select the appropriate brand channel for this partner. Your selection will be automatically updated in the system.</em></p>
          
          <p>Best regards,<br>Uncoded Team</p>
        </div>
      </div>
    </body>
    </html>
  `
}
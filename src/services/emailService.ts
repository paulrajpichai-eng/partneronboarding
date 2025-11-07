export interface SpocEmailData {
  spocName: string;
  spocEmail: string;
  partnerName: string;
  partnerId: string;
  partnerDetails: {
    ownerName: string;
    firmName: string;
    email: string;
    mobile: string;
    country: string;
    brand: string;
    business: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
  };
  brandChannelOptions: Array<{
    numericValue: number;
    brandChannel: string;
  }>;
}

export class EmailService {
  // Send email to SPOC for brand channel selection
  static async sendSpocBrandChannelEmail(emailData: SpocEmailData): Promise<void> {
    try {
      console.log('🚀 Starting SPOC email process...');
      console.log('📧 Email will be sent to:', emailData.spocEmail);
      console.log('👤 SPOC Name:', emailData.spocName);
      console.log('🏢 Partner:', emailData.partnerName);
      console.log('🆔 Partner ID:', emailData.partnerId);
      
      // Get Supabase configuration
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      // Check if Supabase is properly configured
      const isSupabaseConfigured = supabaseUrl && 
                                  supabaseUrl !== 'your-supabase-url' && 
                                  supabaseAnonKey && 
                                  supabaseAnonKey !== 'your-supabase-anon-key' &&
                                  supabaseUrl.includes('supabase.co');
      
      if (!isSupabaseConfigured) {
        console.warn('⚠️ Supabase not configured - using simulation mode');
        this.simulateEmailSending(emailData);
        return;
      }
      
      console.log('✅ Supabase configured - attempting real email...');
      
      // Prepare email payload
      const emailPayload = {
        spocEmail: emailData.spocEmail,
        spocName: emailData.spocName,
        partnerName: emailData.partnerName,
        partnerId: emailData.partnerId,
        partnerDetails: emailData.partnerDetails,
        brandChannelOptions: emailData.brandChannelOptions
      };
      
      // Call Supabase Edge Function
      const edgeFunctionUrl = `${supabaseUrl}/functions/v1/send-spoc-email`;
      console.log('📡 Calling Edge Function:', edgeFunctionUrl);
      
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey
        },
        body: JSON.stringify(emailPayload)
      });
      
      console.log('📨 Edge Function Response Status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Edge Function Error:', errorText);
        
        // Fallback to simulation
        console.log('🔄 Falling back to simulation...');
        this.simulateEmailSending(emailData, `Edge Function Error: ${errorText}`);
        return;
      }
      
      const result = await response.json();
      console.log('✅ Email sent successfully:', result);
      
      // Show success message
      alert(`✅ EMAIL SENT SUCCESSFULLY!\n\n📧 To: ${emailData.spocEmail}\n👤 SPOC: ${emailData.spocName}\n🏢 Partner: ${emailData.partnerName}\n\n📋 The SPOC will receive an email with:\n• Partner details\n• Brand channel selection form\n• ${emailData.brandChannelOptions.length} brand channel options\n\n🔄 Once selected, the brand channel will automatically update in the system.`);
      
    } catch (error) {
      console.error('❌ Email service error:', error);
      this.simulateEmailSending(emailData, error.message);
    }
  }

  // Simulate email sending for development/fallback
  private static simulateEmailSending(emailData: SpocEmailData, errorDetails?: string): void {
    console.log('📧 SIMULATING EMAIL SEND');
    console.log('='.repeat(50));
    console.log('📬 TO:', emailData.spocEmail);
    console.log('👤 SPOC:', emailData.spocName);
    console.log('📋 SUBJECT: Brand channel needed for the partner –', emailData.partnerName);
    console.log('🏢 PARTNER DETAILS:');
    console.log('  • Owner:', emailData.partnerDetails.ownerName);
    console.log('  • Firm:', emailData.partnerDetails.firmName);
    console.log('  • Email:', emailData.partnerDetails.email);
    console.log('  • Mobile:', emailData.partnerDetails.mobile);
    console.log('  • Country:', emailData.partnerDetails.country);
    console.log('  • Brand:', emailData.partnerDetails.brand);
    console.log('  • Business:', emailData.partnerDetails.business);
    console.log('  • Address:', `${emailData.partnerDetails.address}, ${emailData.partnerDetails.city}, ${emailData.partnerDetails.state} - ${emailData.partnerDetails.pinCode}`);
    console.log('🎯 BRAND CHANNEL OPTIONS:');
    emailData.brandChannelOptions.forEach(option => {
      console.log(`  • ${option.numericValue}: ${option.brandChannel}`);
    });
    console.log('='.repeat(50));
    
    // Create detailed alert message
    let alertMessage = `📧 EMAIL SIMULATION\n\n`;
    alertMessage += `📬 TO: ${emailData.spocEmail}\n`;
    alertMessage += `👤 SPOC: ${emailData.spocName}\n`;
    alertMessage += `🏢 PARTNER: ${emailData.partnerName}\n`;
    alertMessage += `🆔 PARTNER ID: ${emailData.partnerId}\n\n`;
    
    if (errorDetails) {
      alertMessage += `⚠️ REASON FOR SIMULATION:\n${errorDetails}\n\n`;
    } else {
      alertMessage += `ℹ️ REASON: Supabase not configured for real emails\n\n`;
    }
    
    alertMessage += `📋 EMAIL WOULD CONTAIN:\n`;
    alertMessage += `• Complete partner details\n`;
    alertMessage += `• ${emailData.brandChannelOptions.length} brand channel options\n`;
    alertMessage += `• Interactive selection form\n\n`;
    
    alertMessage += `🔧 TO ENABLE REAL EMAILS:\n`;
    alertMessage += `1. Set up Supabase properly\n`;
    alertMessage += `2. Deploy Edge Functions\n`;
    alertMessage += `3. Configure email service (Resend/SendGrid)\n\n`;
    
    alertMessage += `✅ PARTNER CREATED SUCCESSFULLY!\nThe partner record has been created and is ready for processing.`;
    
    alert(alertMessage);
  }
}
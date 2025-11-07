import { supabase } from '../lib/supabase';
import { EmailService } from './emailService';
import { AdminService } from './adminService';
import type { Partner, Location, User, Milestone, BOSTask, PricingTask } from '../lib/supabase';

export class PartnerService {
  static async testConnection(): Promise<void> {
    try {
      const { error } = await supabase.from('partners').select('id').limit(1);
      if (error) {
        throw new Error(`Supabase connection failed: ${error.message}`);
      }
    } catch (error) {
      // Handle network errors, CORS issues, etc.
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Network connection failed. Please check your internet connection and Supabase configuration.');
      }
      throw error;
    }
  }

  // Create a new partner
  static async createPartner(partnerData: Omit<Partner, 'id' | 'created_at' | 'updated_at'>) {
    console.log('PartnerService.createPartner called with:', partnerData);
    
    const { data, error } = await supabase
      .from('partners')
      .insert([partnerData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating partner:', error);
      throw new Error(`Failed to create partner: ${error.message}`);
    }
    
    if (!data) {
      console.error('No data returned from partner creation');
      throw new Error('Partner was not created - no data returned');
    }
    
    console.log('Partner created successfully in database:', data);
    return data;
  }

  // Get partner by ID
  static async getPartner(id: string) {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Get partner with all related data
  static async getPartnerWithRelations(id: string) {
    const { data, error } = await supabase
      .from('partners')
      .select(`
        *,
        locations(*),
        users!users_partner_id_fkey(*),
        milestones(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Get all partners
  static async getAllPartners() {
    const { data, error } = await supabase
      .from('partners')
      .select(`
        *,
        locations(*),
        users(*),
        milestones(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Update partner
  static async updatePartner(id: string, updates: Partial<Partner>) {
    const { data, error } = await supabase
      .from('partners')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Create location
  static async createLocation(locationData: Omit<Location, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('locations')
      .insert([locationData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get locations for partner
  static async getPartnerLocations(partnerId: string) {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Create user
  static async createUser(userData: Omit<User, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Create partner user with login credentials
  static async createPartnerUser(userData: {
    partner_id: string;
    username: string;
    email: string;
    password_hash: string;
    plan_id?: string;
    feature_rights?: string[];
  }) {
    const { data, error } = await supabase
      .from('partner_users')
      .insert([{
        partner_id: userData.partner_id,
        username: userData.username,
        email: userData.email,
        password_hash: userData.password_hash,
        is_active: true
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get users for partner
  static async getPartnerUsers(partnerId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Create milestone
  static async createMilestone(milestoneData: Omit<Milestone, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('milestones')
      .insert([milestoneData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update milestone
  static async updateMilestone(id: string, updates: Partial<Milestone>) {
    const { data, error } = await supabase
      .from('milestones')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get milestones for partner
  static async getPartnerMilestones(partnerId: string) {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  // Send email to SPOC for brand channel selection
  static async sendSpocBrandChannelEmail(partnerId: string, spocId: string) {
    try {
      console.log('🚀 STARTING SPOC EMAIL PROCESS');
      console.log('🆔 Partner ID:', partnerId);
      console.log('👤 SPOC ID:', spocId);
      
      // Get partner details
      const partner = await this.getPartner(partnerId);
      if (!partner) {
        throw new Error('Partner not found');
      }
      console.log('✅ Partner found:', partner.firm_name);

      // Get SPOC details from spoc_mappings table
      let spocMappings = [];
      let spocMapping = null;
      
      try {
        spocMappings = await AdminService.getAllSpocMappings();
        console.log('📋 Available SPOC mappings:', spocMappings.length);
        spocMapping = spocMappings.find(mapping => mapping.spoc_id === spocId);
      } catch (error) {
        console.error('❌ Error fetching SPOC mappings:', error);
        throw new Error('Unable to fetch SPOC mappings from database. Please ensure the database is properly configured.');
      }
      
      if (!spocMapping) {
        console.error('❌ SPOC mapping not found for SPOC ID:', spocId);
        console.log('📋 Available SPOC IDs:', spocMappings.map(s => s.spoc_id));
        
        const availableSpocs = spocMappings.map(s => `${s.spoc_id} (${s.name})`).join(', ');
        const errorMsg = availableSpocs.length > 0 
          ? `SPOC ID "${spocId}" not found. Available SPOCs: ${availableSpocs}`
          : `SPOC ID "${spocId}" not found. No SPOC mappings exist in database. Please add SPOC mappings first.`;
        throw new Error(errorMsg);
      }
      console.log('✅ SPOC found:', spocMapping.name, spocMapping.email);

      // Get brand channel options from brand_channel_mappings table
      let brandChannelMappings = [];
      
      try {
        brandChannelMappings = await AdminService.getAllBrandChannelMappings();
        console.log('📋 Brand channel mappings found:', brandChannelMappings.length);
      } catch (error) {
        console.error('❌ Error fetching brand channel mappings:', error);
        throw new Error('Unable to fetch brand channel mappings from database. Please ensure the database is properly configured.');
      }
      
      if (!brandChannelMappings || brandChannelMappings.length === 0) {
        console.warn('⚠️ No brand channel mappings found');
        throw new Error('No brand channel mappings found in database. Please add brand channel mappings in the admin panel first.');
      }

      // Prepare email data
      const emailData = {
        spocName: spocMapping.name,
        spocEmail: spocMapping.email,
        partnerName: partner.firm_name,
        partnerId: partner.id,
        partnerDetails: {
          ownerName: partner.owner_name,
          firmName: partner.firm_name,
          email: partner.email,
          mobile: partner.mobile,
          country: partner.country,
          brand: partner.brand,
          business: partner.business,
          address: partner.address,
          city: partner.city,
          state: partner.state,
          pinCode: partner.pin_code
        },
        brandChannelOptions: brandChannelMappings.map(mapping => ({
          numericValue: mapping.numeric_value,
          brandChannel: mapping.brand_channel
        }))
      };
      
      console.log('📧 Email data prepared for:', emailData.spocEmail);
      console.log('🎯 Email will include', emailData.brandChannelOptions.length, 'brand channel options');

      // Send email to SPOC
      await EmailService.sendSpocBrandChannelEmail(emailData);
      
      console.log(`✅ Email process completed for SPOC ${spocMapping.name} (${spocMapping.email}) and partner ${partner.firm_name}`);
      
    } catch (error) {
      console.error('❌ SPOC email process failed:', error);
      
      // Show user-friendly error message
      let errorMessage = `❌ SPOC EMAIL PROCESS FAILED\n\n`;
      errorMessage += `🔍 Error Details:\n${error.message}\n\n`;
      errorMessage += `✅ PARTNER CREATED SUCCESSFULLY\n`;
      errorMessage += `The partner record has been created, but the SPOC email could not be sent.\n\n`;
      errorMessage += `🔧 TROUBLESHOOTING:\n`;
      errorMessage += `1. Check if SPOC ID "${spocId}" exists in database\n`;
      errorMessage += `2. Verify brand channel mappings exist\n`;
      errorMessage += `3. Ensure Supabase is properly configured\n`;
      errorMessage += `4. Check browser console for detailed logs`;
      
      alert(errorMessage);
      throw error;
    }
  }

  // Complete user creation phase
  static async completeUserCreation(partnerId: string) {
    try {
      // Update partner status to completed
      await this.updatePartner(partnerId, { status: 'completed' });
      
      // Update milestones
      const milestones = await this.getPartnerMilestones(partnerId);
      const userCreationMilestone = milestones.find(m => m.name === 'User Creation');
      const youreNowLiveMilestone = milestones.find(m => m.name === "You're now Live");
      
      if (userCreationMilestone && userCreationMilestone.status !== 'completed') {
        await this.updateMilestone(userCreationMilestone.id, {
          status: 'completed',
          completed_at: new Date().toISOString(),
          duration: userCreationMilestone.started_at ? 
            Math.floor((new Date().getTime() - new Date(userCreationMilestone.started_at).getTime()) / 60000) : 
            5
        });
      }
      
      if (youreNowLiveMilestone && youreNowLiveMilestone.status !== 'completed') {
        await this.updateMilestone(youreNowLiveMilestone.id, {
          status: 'completed',
          completed_at: new Date().toISOString(),
          started_at: new Date().toISOString(),
          duration: 1
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error completing user creation:', error);
      throw error;
    }
  }
}
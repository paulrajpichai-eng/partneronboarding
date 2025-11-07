import { supabase } from '../lib/supabase';
import type { SpocMapping, BrandChannelMapping } from '../lib/supabase';

export class AdminService {
  // SPOC Mappings
  static async getAllSpocMappings() {
    const { data, error } = await supabase
      .from('spoc_mappings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createSpocMapping(mappingData: Omit<SpocMapping, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('spoc_mappings')
      .insert([mappingData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteSpocMapping(id: string) {
    const { error } = await supabase
      .from('spoc_mappings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Brand Channel Mappings
  static async getAllBrandChannelMappings() {
    const { data, error } = await supabase
      .from('brand_channel_mappings')
      .select('*')
      .order('numeric_value', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async createBrandChannelMapping(mappingData: Omit<BrandChannelMapping, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('brand_channel_mappings')
      .insert([mappingData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteBrandChannelMapping(id: string) {
    const { error } = await supabase
      .from('brand_channel_mappings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Analytics
  static async getAnalytics() {
    try {
      // Get total partners
      const { count: totalPartners } = await supabase
        .from('partners')
        .select('*', { count: 'exact', head: true });

      // Get completed onboardings
      const { count: completedOnboardings } = await supabase
        .from('partners')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      // Get average onboarding duration
      const { data: milestones } = await supabase
        .from('milestones')
        .select('duration')
        .not('duration', 'is', null);

      const totalDuration = milestones?.reduce((sum, m) => sum + (m.duration || 0), 0) || 0;
      const averageOnboardingDuration = milestones?.length ? Math.round(totalDuration / milestones.length / 60 / 24 * 10) / 10 : 0;

      // Calculate conversion rate
      const conversionRate = totalPartners ? Math.round((completedOnboardings || 0) / totalPartners * 100) : 0;

      // Get milestone analytics
      const { data: registrationMilestones } = await supabase
        .from('milestones')
        .select('duration')
        .eq('name', 'Registration')
        .not('duration', 'is', null);

      const { data: reviewMilestones } = await supabase
        .from('milestones')
        .select('duration')
        .eq('name', 'In Review')
        .not('duration', 'is', null);

      const { data: userCreationMilestones } = await supabase
        .from('milestones')
        .select('duration')
        .eq('name', 'User Creation')
        .not('duration', 'is', null);

      const getAverageDuration = (milestones: any[]) => {
        if (!milestones?.length) return 0;
        const total = milestones.reduce((sum, m) => sum + (m.duration || 0), 0);
        return Math.round(total / milestones.length);
      };

      return {
        totalPartners: totalPartners || 0,
        completedOnboardings: completedOnboardings || 0,
        averageOnboardingDuration,
        supportButtonUsage: 47, // This would come from actual support system
        conversionRate,
        milestoneAnalytics: {
          registration: {
            average: getAverageDuration(registrationMilestones || []),
            count: registrationMilestones?.length || 0
          },
          review: {
            average: getAverageDuration(reviewMilestones || []),
            count: reviewMilestones?.length || 0
          },
          userCreation: {
            average: getAverageDuration(userCreationMilestones || []),
            count: userCreationMilestones?.length || 0
          }
        }
      };
    } catch (error) {
      console.error('Error in getAnalytics:', error);
      throw error;
    }
  }
}
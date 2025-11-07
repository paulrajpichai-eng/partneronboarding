import { supabase } from '../lib/supabase';
import type { PricingTask } from '../lib/supabase';

export class PricingService {
  // Get all pricing tasks
  static async getAllTasks() {
    const { data, error } = await supabase
      .from('pricing_tasks')
      .select(`
        *,
        partners(*)
      `)
      .order('assigned_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Create pricing task
  static async createTask(taskData: Omit<PricingTask, 'id' | 'assigned_at'>) {
    const { data, error } = await supabase
      .from('pricing_tasks')
      .insert([taskData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update pricing task
  static async updateTask(id: string, updates: Partial<PricingTask>) {
    const { data, error } = await supabase
      .from('pricing_tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Complete pricing task
  static async completeTask(id: string) {
    console.log('🎯 PricingService: Completing pricing task', id);
    
    const { data, error } = await supabase
      .from('pricing_tasks')
      .update({
        status: 'completed',
        margin_configured: true,
        completed_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    console.log('✅ PricingService: Pricing task completed successfully');
    return data;
  }
}
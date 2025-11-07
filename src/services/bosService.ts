import { supabase } from '../lib/supabase';
import type { BOSTask } from '../lib/supabase';

export class BOSService {
  // Get all BOS tasks
  static async getAllTasks() {
    const { data, error } = await supabase
      .from('bos_tasks')
      .select(`
        *,
        partners(*)
      `)
      .order('assigned_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Create BOS task
  static async createTask(taskData: Omit<BOSTask, 'id' | 'assigned_at'>) {
    const { data, error } = await supabase
      .from('bos_tasks')
      .insert([taskData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update BOS task
  static async updateTask(id: string, updates: Partial<BOSTask>) {
    const { data, error } = await supabase
      .from('bos_tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Complete BOS task
  static async completeTask(id: string, planId: string, featureRights: string[]) {
    const { data, error } = await supabase
      .from('bos_tasks')
      .update({
        status: 'completed',
        plan_id: planId,
        feature_rights: featureRights,
        completed_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
import { supabase } from './supabase';

export const fetchSettings = async () => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

export const updateSettings = async (settings) => {
  const { data, error } = await supabase
    .from('settings')
    .update(settings)
    .eq('id', settings.id);

  if (error) throw error;
  return data;
};
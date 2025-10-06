import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key are required. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Helper functions for proposal tracking
export const proposalTrackingService = {
  // Get all proposals with execution status for citizen view
  async getProposalsForCitizens(filters = {}) {
    let query = supabase?.from('proposals')?.select(`
        id,
        titulo,
        descricao,
        localidade,
        orcamento_aprovado,
        categoria,
        status,
        approved_at,
        execution_status:execution_status(
          percentual_fisico,
          percentual_financeiro,
          status_execucao,
          atualizado_em
        )
      `)?.eq('status', 'em_execucao');

    // Apply filters
    if (filters?.localidade) {
      query = query?.eq('localidade', filters?.localidade);
    }
    if (filters?.status_execucao) {
      query = query?.eq('execution_status.status_execucao', filters?.status_execucao);
    }
    if (filters?.categoria) {
      query = query?.eq('categoria', filters?.categoria);
    }

    const { data, error } = await query?.order('approved_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching proposals for citizens:', error);
      throw error;
    }
    
    return data;
  },

  // Get all proposals for manager view (approved or em_execucao)
  async getProposalsForManagers(filters = {}) {
    let query = supabase?.from('proposals')?.select(`
        id,
        titulo,
        descricao,
        localidade,
        orcamento_aprovado,
        categoria,
        status,
        approved_at,
        created_by,
        execution_status:execution_status(
          id,
          percentual_fisico,
          percentual_financeiro,
          status_execucao,
          comentarios_internos,
          atualizado_em,
          atualizado_por
        ),
        created_by_profile:user_profiles!proposals_created_by_fkey(
          nome,
          email
        )
      `)?.in('status', ['approved', 'em_execucao']);

    const { data, error } = await query?.order('approved_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching proposals for managers:', error);
      throw error;
    }
    
    return data;
  },

  // Update execution status (managers only)
  async updateExecutionStatus(proposalId, executionData) {
    const { data: currentUser, error: userError } = await supabase?.auth?.getUser();
    if (userError || !currentUser?.user) {
      throw new Error('User not authenticated');
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase?.from('user_profiles')?.select('id')?.eq('user_id', currentUser?.user?.id)?.single();

    if (profileError || !userProfile) {
      throw new Error('User profile not found');
    }

    // Check if execution status exists for this proposal
    const { data: existingStatus, error: checkError } = await supabase?.from('execution_status')?.select('id')?.eq('proposta_id', proposalId)?.single();

    let result;
    if (existingStatus) {
      // Update existing status
      const { data, error } = await supabase?.from('execution_status')?.update({
          percentual_fisico: executionData?.percentual_fisico,
          percentual_financeiro: executionData?.percentual_financeiro,
          status_execucao: executionData?.status_execucao,
          comentarios_internos: executionData?.comentarios_internos,
          atualizado_em: new Date()?.toISOString(),
          atualizado_por: userProfile?.id
        })?.eq('id', existingStatus?.id)?.select();

      result = { data, error };
    } else {
      // Create new status
      const { data, error } = await supabase?.from('execution_status')?.insert({
          proposta_id: proposalId,
          percentual_fisico: executionData?.percentual_fisico,
          percentual_financeiro: executionData?.percentual_financeiro,
          status_execucao: executionData?.status_execucao,
          comentarios_internos: executionData?.comentarios_internos,
          atualizado_por: userProfile?.id
        })?.select();

      result = { data, error };
    }

    if (result?.error) {
      console.error('Error updating execution status:', result?.error);
      throw result?.error;
    }

    return result?.data;
  },

  // Get unique localities for filter
  async getUniqueLocalities() {
    const { data, error } = await supabase?.from('proposals')?.select('localidade')?.eq('status', 'em_execucao');

    if (error) {
      console.error('Error fetching localities:', error);
      throw error;
    }

    const uniqueLocalities = [...new Set(data?.map(item => item.localidade) || [])];
    return uniqueLocalities;
  },

  // Get unique categories for filter
  async getUniqueCategories() {
    const { data, error } = await supabase?.from('proposals')?.select('categoria')?.eq('status', 'em_execucao');

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    const uniqueCategories = [...new Set(data?.map(item => item.categoria) || [])];
    return uniqueCategories;
  }
};

// Real-time subscriptions for proposal updates
export const setupProposalSubscription = (callback) => {
  const channel = supabase?.channel('proposal_updates')?.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'execution_status'
      },
      callback
    )?.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'proposals'
      },
      callback
    )?.subscribe();

  return channel;
};
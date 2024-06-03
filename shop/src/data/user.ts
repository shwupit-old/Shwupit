import { useMutation, useQuery, useQueryClient } from 'react-query';
import { supabase } from '@/data/utils/supabaseClient';

export function useMe() {
  const fetchUser = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    const user = sessionData?.session?.user;
    if (!user) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  };

  const { data, isLoading, error, refetch } = useQuery('me', fetchUser, {
    enabled: !!supabase.auth.getSession(),
    staleTime: 5 * 60 * 1000, // Cache the data for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep the data in cache for 10 minutes
  });

  const isAuthorized = !!data && !error;

  return {
    me: data,
    isLoading,
    error,
    isAuthorized,
    refetch,
  };
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.resetQueries('me');
        queryClient.invalidateQueries();
      },
    }
  );
}
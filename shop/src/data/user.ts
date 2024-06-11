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

    // Fetching user data from the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name, country, username, email, currency, profile_picture_url, bio, last_username_change')
      .eq('id', user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    // Combine the session data with profile data
    return {
      id: user.id,
      username: profileData.username,
      email: profileData.email,
      firstName: profileData.first_name,
      lastName: profileData.last_name,
      country: profileData.country,
      currency: profileData.currency,
      profilePictureURL: profileData.profile_picture_url,
      lastUsernameChange: profileData.last_username_change,
      bio: profileData.bio,
    };
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
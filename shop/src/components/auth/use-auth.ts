import { atom, useAtom } from 'jotai';
import { useQueryClient } from 'react-query';
import { supabase } from '@/data/utils/supabaseClient';
import {
  checkHasAuthToken,
  getAuthToken,
  removeAuthToken,
  setAuthToken,
} from '@/data/client/token.utils';

const authorizationAtom = atom(checkHasAuthToken());
const userAtom = atom(null);  

export default function useAuth() {
  const [isAuthorized, setAuthorized] = useAtom(authorizationAtom);
  const [user, setUser] = useAtom(userAtom);
  const queryClient = useQueryClient(); // Initialize queryClient

  const fetchUserProfile = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Failed to get session', sessionError);
      setUser(null);
      setAuthorized(false);
      return;
    }

    const user = sessionData?.session?.user;
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Failed to fetch user profile', error);
        setUser(null);
      } else {
        setUser(data);
      }
    } else {
      setUser(null);
      setAuthorized(false);
    }
  };

  return {
    setToken: (token: string) => {
      setAuthToken(token);
      setAuthorized(true);
      fetchUserProfile();
    },
    getToken: getAuthToken,
    isAuthorized,
    user,
    authorize: async (token: string) => {
      setAuthToken(token);
      setAuthorized(true);
      await fetchUserProfile();
      queryClient.invalidateQueries('me'); // Invalidate queries after authorization
    },
    unauthorize: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error);
      } else {
        setAuthorized(false);
        removeAuthToken();
        setUser(null);
        queryClient.invalidateQueries('me'); // Invalidate queries after unauthorization
      }
    },
  };
}
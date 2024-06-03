import { atom, useAtom } from 'jotai';
import {
  checkHasAuthToken,
  getAuthToken,
  removeAuthToken,
  setAuthToken,
} from '@/data/client/token.utils';
import { supabase } from '@/data/utils/supabaseClient';

const authorizationAtom = atom(checkHasAuthToken());
const userAtom = atom(null);

export default function useAuth() {
  const [isAuthorized, setAuthorized] = useAtom(authorizationAtom);
  const [user, setUser] = useAtom(userAtom);

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
    },
    unauthorize: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error);
      } else {
        setAuthorized(false);
        removeAuthToken();
        setUser(null);
      }
    },
  };
}
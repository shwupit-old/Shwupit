import { atom, useAtom } from 'jotai';
import axios from 'axios';
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

  const fetchUserProfile = async () => {
    const token = getAuthToken();
    if (token) {
      try {
        const response = await axios.get('http://localhost:8080/api/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user profile', error);
      }
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
    authorize(token: string) {
      setAuthToken(token);
      setAuthorized(true);
      fetchUserProfile();
    },
    unauthorize() {
      setAuthorized(false);
      removeAuthToken();
      setUser(null);
    },
  };
}
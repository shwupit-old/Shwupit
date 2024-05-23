import type { User } from '@/types';
import useAuth from '@/components/auth/use-auth';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { HttpClient } from './client/http-client';
import { API_ENDPOINTS } from './client/endpoints';

export function useMe() {
  const { isAuthorized } = useAuth();
  const { data, isLoading, error } = useQuery<User, Error>(
    [API_ENDPOINTS.USERS_ME],
    () => HttpClient.get<User>(API_ENDPOINTS.USERS_ME),
    {
      enabled: isAuthorized,
    }
  );
  return {
    me: data,
    isLoading,
    error,
    isAuthorized,
  };
}

export function useLogout() {
  const { unauthorize } = useAuth();
  const queryClient = useQueryClient();
  return useMutation(() => HttpClient.logout(), {
    onSuccess: () => {
      unauthorize();
      queryClient.resetQueries(API_ENDPOINTS.USERS_ME);
    },
  });
}
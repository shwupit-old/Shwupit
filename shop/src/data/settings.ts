import type { Settings } from '@/types';
import { useMutation, useQuery } from 'react-query';
import client from './client';
import { useRouter } from 'next/router';
import { useState } from 'react';

export const useSettings = () => {
  const { locale } = useRouter();

  const formattedOptions = {
    language: locale,
  };

  const { data, isLoading, error } = useQuery<Settings, Error>(
    ['settings', formattedOptions],
    () => client.settings.all(formattedOptions)
  );

  return {
    settings: data?.options,
    isLoading,
    error,
  };
};

export function useSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const subscription = useMutation(
    (email: string) => client.settings.subscribe({ email }), 
    {
      onSuccess: () => {
        setIsSubscribed(true);
      },
      onError: () => {
        setIsSubscribed(false);
      },
    }
  );

  return {
    ...subscription,
    isSubscribed,
  };
}
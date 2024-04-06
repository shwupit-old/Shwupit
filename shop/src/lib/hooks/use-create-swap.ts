import { useMutation } from 'react-query';
import client from '@/data/client';
import { HttpClient } from '@/data/client/http-client';
import { API_ENDPOINTS } from '@/data/client/endpoints';

const useCreateSwap = () => {
  return useMutation(newSwap => HttpClient.post(API_ENDPOINTS.CREATE_SWAP, newSwap));
};

export default useCreateSwap;
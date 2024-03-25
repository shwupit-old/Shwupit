
import { useQuery } from 'react-query';
import client from '@/data/client';
import { HttpClient } from '@/data/client/http-client';
import { API_ENDPOINTS } from '@/data/client/endpoints';

const useListSwaps = () => {
  return useQuery('createSwap', () => HttpClient.get(API_ENDPOINTS.CREATE_SWAP));
};


export default useListSwaps
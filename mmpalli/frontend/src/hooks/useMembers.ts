import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../config/api'; // Changed from publicApi to adminApi

export const useMembers = (search: string = '') => {
  return useQuery({
    queryKey: ['members', search],
    queryFn: async () => {
      // This will now send your secret API Key automatically
      const { data } = await adminApi.get('/foundation/members', {
        params: { search }
      });
      return data;
    }
  });
};
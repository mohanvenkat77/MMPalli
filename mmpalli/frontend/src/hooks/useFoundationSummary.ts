import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../config/api';

export const useFoundationSummary = (financialYear?: string) => {
  return useQuery({
    queryKey: ['foundationSummary', financialYear],
    queryFn: async () => {
      const { data } = await publicApi.get('/foundation/summary', {
        params: { financial_year: financialYear }
      });
      return data; // This matches the JSON sent from your backend publicController!
    }
  });
};
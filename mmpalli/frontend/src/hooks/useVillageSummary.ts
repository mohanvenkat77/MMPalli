import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../config/api';

export const useVillageSummary = (financialYear?: string) => {
  return useQuery({
    queryKey: ['villageSummary', financialYear],
    queryFn: async () => {
      const { data } = await publicApi.get('/village/summary', {
        params: { financial_year: financialYear }
      });
      return data;
    }
  });
};
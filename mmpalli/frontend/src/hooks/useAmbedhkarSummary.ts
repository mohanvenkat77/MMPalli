import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../config/api';

export const useAmbedhkarSummary = (financialYear?: string) => {
  return useQuery({
    queryKey: ['ambedhkarSummary', financialYear],
    queryFn: async () => {
      const { data } = await publicApi.get('/ambedhkar-jayanthi/summary', {
        params: { financial_year: financialYear }
      });
      return data;
    }
  });
};

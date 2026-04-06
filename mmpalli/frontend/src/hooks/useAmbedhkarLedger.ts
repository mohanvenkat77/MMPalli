import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../config/api';

export const useAmbedhkarLedger = (financialYear: string, type: string = 'ALL', page: number = 1) => {
  return useQuery({
    queryKey: ['ambedhkarLedger', financialYear, type, page],
    queryFn: async () => {
      const params: any = { financial_year: financialYear, page, limit: 10 };
      if (type !== 'ALL') params.type = type;

      const { data } = await publicApi.get('/ambedhkar-jayanthi/ledger', { params });
      return data;
    }
  });
};

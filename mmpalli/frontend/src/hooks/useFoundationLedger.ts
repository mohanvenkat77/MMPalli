import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../config/api';

export const useFoundationLedger = (financialYear: string, type: string = 'ALL', page: number = 1) => {
  return useQuery({
    queryKey: ['foundationLedger', financialYear, type, page],
    queryFn: async () => {
      // If type is 'ALL', we don't send it to the backend so it returns everything
      const params: any = { financial_year: financialYear, page, limit: 10 };
      if (type !== 'ALL') params.type = type;

      const { data } = await publicApi.get('/foundation/ledger', { params });
      return data;
    }
  });
};
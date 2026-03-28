import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../config/api';

export const useVillageLedger = (financialYear: string, type: string = 'ALL', page: number = 1) => {
  return useQuery({
    queryKey: ['villageLedger', financialYear, type, page],
    queryFn: async () => {
      const params: any = { financial_year: financialYear, page, limit: 10 };
      if (type !== 'ALL') params.type = type;

      const { data } = await publicApi.get('/village/ledger', { params });
      return data;
    }
  });
};
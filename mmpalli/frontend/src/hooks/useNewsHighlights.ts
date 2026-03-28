import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../config/api';

export const useNewsHighlights = (month?: string) => {
  return useQuery({
    queryKey: ['newsHighlights', month],
    queryFn: async () => {
      const { data } = await publicApi.get('/news', {
        params: { month }
      });
      return data;
    }
  });
};
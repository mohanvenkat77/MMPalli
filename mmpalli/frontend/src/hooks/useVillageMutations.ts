import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../config/api';

export const useLogVillageTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { party_name: string; amount: number; type: string; category: string; description: string }) => {
      const res = await adminApi.post('/village/log-transaction', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['villageLedger'] });
      queryClient.invalidateQueries({ queryKey: ['villageSummary'] });
    }
  });
};
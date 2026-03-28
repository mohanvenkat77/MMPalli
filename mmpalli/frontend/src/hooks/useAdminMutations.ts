import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../config/api';

export const useLogMonthlyFee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { phone_number: string; amount: number; payment_mode: string; description: string }) => {
      const res = await adminApi.post('/foundation/log-monthly-fee', data);
      return res.data;
    },
    onSuccess: () => {
      // This tells React Query to refresh ANY query that starts with these names
      queryClient.invalidateQueries({ queryKey: ['foundationLedger'] });
      queryClient.invalidateQueries({ queryKey: ['foundationSummary'] });
    }
  });
};

export const useAddMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // 'data' here will be the object we send from the Modal
    mutationFn: async (data: any) => {
      const res = await adminApi.post('/foundation/add-member', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foundationSummary'] });
      queryClient.invalidateQueries({ queryKey: ['foundationLedger'] });
    }
  });
};
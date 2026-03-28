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
      // 1. Invalidates the cache (Marks it as 'stinking' so React Query knows to bin it)
      queryClient.invalidateQueries({ queryKey: ['foundationSummary'] });
      queryClient.invalidateQueries({ queryKey: ['foundationLedger'] });

      // 2. Forces an immediate background refetch for everything
      queryClient.refetchQueries({ exact: false, type: 'active' });
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
      // 1. Invalidates the cache (Marks it as 'stinking' so React Query knows to bin it)
      queryClient.invalidateQueries({ queryKey: ['foundationSummary'] });
      queryClient.invalidateQueries({ queryKey: ['foundationLedger'] });

      // 2. Forces an immediate background refetch for everything
      queryClient.refetchQueries({ exact: false, type: 'active' });
    }
  });
};

export const useBulkMonthlyFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { member_list: any[]; month: string; amount: number }) => {
      const res = await adminApi.post('/foundation/log-monthly-fee-bulk', data);
      return res.data;
    },
    onSuccess: () => {
      // Refresh everything so the new totals show up on the dashboard
      queryClient.invalidateQueries({ queryKey: ['foundationSummary'] });
      queryClient.invalidateQueries({ queryKey: ['foundationLedger'] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
    }
  });
};
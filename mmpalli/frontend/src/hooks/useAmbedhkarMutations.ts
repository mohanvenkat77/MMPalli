import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../config/api';

export const useLogAmbedhkarTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      contributor_name: string;
      amount: number;
      type: string;
      category: string;
      description: string;
    }) => {
      const res = await adminApi.post('/ambedhkar-jayanthi/log-transaction', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ambedhkarLedger'] });
      queryClient.invalidateQueries({ queryKey: ['ambedhkarSummary'] });
      queryClient.refetchQueries({ queryKey: ['ambedhkarLedger'], type: 'active' });
      queryClient.refetchQueries({ queryKey: ['ambedhkarSummary'], type: 'active' });
    }
  });
};

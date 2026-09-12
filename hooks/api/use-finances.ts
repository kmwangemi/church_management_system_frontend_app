import { financesService } from '@/lib/api/finances';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useOfferings = () => {
  return useQuery({
    queryKey: ['offerings'],
    queryFn: financesService.getOfferings,
  });
};

export const useRecordOffering = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (offeringData: any) => financesService.recordOffering(offeringData),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['offerings'] });
    },
  });
};

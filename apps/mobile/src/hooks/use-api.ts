import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api-client';

// Query Keys
export const QUERY_KEYS = {
  HEALTH: ['health'],
  SUBJECTS: ['subjects'],
  SUBJECT: (id: string) => ['subjects', id],
  STUDY_CYCLES: ['study-cycles'],
  STUDY_CYCLE: (id: string) => ['study-cycles', id],
  USER: ['user'],
} as const;

// Health Check Hook
export const useHealthCheck = () => {
  return useQuery({
    queryKey: QUERY_KEYS.HEALTH,
    queryFn: () => apiClient.healthCheck(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

// Subjects Hooks
export const useSubjects = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SUBJECTS,
    queryFn: async () => {
      const response = await apiClient.get('/subjects');
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useSubject = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.SUBJECT(id),
    queryFn: async () => {
      const response = await apiClient.get(`/subjects/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; hours: number; minutes: number }) => {
      const response = await apiClient.post('/subjects', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUBJECTS });
    },
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data
    }: {
      id: string;
      data: { name?: string; hours?: number; minutes?: number }
    }) => {
      const response = await apiClient.put(`/subjects/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUBJECTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUBJECT(id) });
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/subjects/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUBJECTS });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.SUBJECT(id) });
    },
  });
};

// Study Cycles Hooks
export const useStudyCycles = () => {
  return useQuery({
    queryKey: QUERY_KEYS.STUDY_CYCLES,
    queryFn: async () => {
      const response = await apiClient.get('/study-cycles');
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useStudyCycle = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.STUDY_CYCLE(id),
    queryFn: async () => {
      const response = await apiClient.get(`/study-cycles/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateStudyCycle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/study-cycles', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDY_CYCLES });
    },
  });
};

// Sync Hooks (for offline/online synchronization)
export const useSyncData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (syncData: any) => {
      const response = await apiClient.post('/sync', syncData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all data after sync
      queryClient.invalidateQueries();
    },
  });
};

// Utility hook for API status
export const useApiStatus = () => {
  const healthCheck = useHealthCheck();

  return {
    isOnline: healthCheck.data === true,
    isLoading: healthCheck.isLoading,
    error: healthCheck.error,
    lastChecked: healthCheck.dataUpdatedAt,
  };
};

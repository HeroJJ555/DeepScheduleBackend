// frontend/src/features/classes/useClasses.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';

export function useClasses(schoolId, opts = {}) {
  return useQuery({
    queryKey: ['classes', schoolId],
    queryFn: () => api.get(`/schools/${schoolId}/classes`).then(res => res.data),
    enabled: opts.enabled,
  });
}

export function useCreateClass(schoolId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: data =>
      api.post(`/schools/${schoolId}/classes`, data).then(res => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['classes', schoolId] }),
  });
}

export function useUpdateClass(schoolId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: data =>
      api.put(`/classes/${data.id}`, data).then(res => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['classes', schoolId] }),
  });
}

export function useDeleteClass(schoolId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: id =>
      api.delete(`/classes/${id}`).then(res => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['classes', schoolId] }),
  });
}

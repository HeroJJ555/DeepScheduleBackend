// src/features/subjects/useSubjects.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';

export function useSubjects(schoolId, { enabled = false } = {}) {
  return useQuery({
    queryKey: ['subjects', schoolId],
    queryFn: () => api.get(`/schools/${schoolId}/subjects`).then(r => r.data),
    enabled,
  });
}

export function useCreateSubject(schoolId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: data => api.post(`/schools/${schoolId}/subjects`, data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subjects', schoolId] }),
  });
}

export function useUpdateSubject(schoolId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }) =>
      api.put(`/subjects/${id}`, { name }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subjects', schoolId] }),
  });
}

export function useDeleteSubject(schoolId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: id => api.delete(`/subjects/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subjects', schoolId] }),
  });
}

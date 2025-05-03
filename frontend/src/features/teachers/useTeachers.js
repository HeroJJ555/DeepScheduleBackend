import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';

export function useTeachers(schoolId, opts = {}) {
  return useQuery({
    queryKey: ['teachers', schoolId],
    queryFn: () =>
      api.get(`/schools/${schoolId}/teachers`).then(r => r.data),
    enabled: opts.enabled ?? false
  });
}

export function useCreateTeacher(schoolId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: data =>
      api
        .post(`/schools/${schoolId}/teachers`, data)
        .then(r => r.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['teachers', schoolId] })
  });
}

export function useUpdateTeacher(schoolId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...rest }) =>
      api
        .put(`/teachers/${id}`, rest)
        .then(r => r.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['teachers', schoolId] })
  });
}

export function useDeleteTeacher(schoolId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: id => api.delete(`/teachers/${id}`),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['teachers', schoolId] })
  });
}

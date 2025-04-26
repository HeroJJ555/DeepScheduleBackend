import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';

export function useTeachers() {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: () => api.get('/teachers').then(res => res.data),
  });
}

export function useCreateTeacher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: data => api.post('/teachers', data).then(res => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teachers'] }),
  });
}

export function useUpdateTeacher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: data =>
      api.put(`/teachers/${data.id}`, data).then(res => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teachers'] }),
  });
}

export function useDeleteTeacher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: id => api.delete(`/teachers/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teachers'] }),
  });
}

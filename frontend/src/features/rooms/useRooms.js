import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';

export function useRooms(schoolId, opts = {}) {
  return useQuery({
    queryKey: ['rooms', schoolId],
    queryFn: () => api.get(`/schools/${schoolId}/rooms`).then(res => res.data),
    enabled: opts.enabled,
  });
}

export function useCreateRoom(schoolId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: data =>
      api.post(`/schools/${schoolId}/rooms`, data).then(res => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rooms', schoolId] }),
  });
}

export function useUpdateRoom(schoolId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: data =>
      api.put(`/rooms/${data.id}`, data).then(res => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rooms', schoolId] }),
  });
}

export function useDeleteRoom(schoolId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: id =>
      api.delete(`/rooms/${id}`).then(res => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rooms', schoolId] }),
  });
}

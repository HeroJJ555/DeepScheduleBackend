import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';

/**
 * Pobiera listę sal w danej szkole.
 * @param {string|number} schoolId
 */
export function useRooms(schoolId)
{
  return useQuery({
    queryKey: ['rooms', schoolId],
    queryFn: () =>
      api.get(`/schools/${schoolId}/rooms`).then(res => res.data),
    enabled: !!schoolId,
  });
}

/**
 * Tworzy nową salę w danej szkole.
 * @param {string|number} schoolId
 */
export function useCreateRoom(schoolId)
{
  const qc = useQueryClient();
  return useMutation({
    mutationFn: data =>
      api.post(`/schools/${schoolId}/rooms`, data).then(res => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rooms', schoolId] });
    },
  });
}

/**
 * Aktualizuje salę po jej ID.
 * @param {string|number} schoolId
 */
export function useUpdateRoom(schoolId)
{
  const qc = useQueryClient();
  return useMutation({
    mutationFn: data =>
      api.put(`/rooms/${data.id}`, data).then(res => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rooms', schoolId] });
    },
  });
}

/**
 * Usuwa salę o danym ID.
 * @param {string|number} schoolId
 */
export function useDeleteRoom(schoolId)
{
  const qc = useQueryClient();
  return useMutation({
    mutationFn: id => api.delete(`/rooms/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rooms', schoolId] });
    },
  });
}
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';

/**
 * Pobiera listę przedmiotów w danej szkole.
 * @param {string|number} schoolId
 */
export function useSubjects(schoolId) {
  return useQuery({
    queryKey: ['subjects', schoolId],
    queryFn: () =>
      api.get(`/schools/${schoolId}/subjects`).then(res => res.data),
    enabled: !!schoolId,
  });
}

/**
 * Tworzy nowy przedmiot w danej szkole.
 * @param {string|number} schoolId
 */
export function useCreateSubject(schoolId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: data =>
      api.post(`/schools/${schoolId}/subjects`, data).then(res => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subjects', schoolId] });
    },
  });
}

/**
 * Aktualizuje przedmiot po jego ID.
 * @param {string|number} schoolId
 */
export function useUpdateSubject(schoolId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: data =>
      api.put(`/subjects/${data.id}`, data).then(res => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subjects', schoolId] });
    },
  });
}

/**
 * Usuwa przedmiot o danym ID.
 * @param {string|number} schoolId
 */
export function useDeleteSubject(schoolId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: id => api.delete(`/subjects/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subjects', schoolId] });
    },
  });
}

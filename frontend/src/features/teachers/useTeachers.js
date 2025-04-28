import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';

/**
 * Pobiera listę nauczycieli w danej szkole.
 * @param {string|number} schoolId
 */
export function useTeachers(schoolId) {
  return useQuery({
    queryKey: ['teachers', schoolId],
    queryFn: () =>
      api.get(`/schools/${schoolId}/teachers`).then(res => res.data),
    enabled: !!schoolId,
  });
}

/**
 * Tworzy nowego nauczyciela w danej szkole.
 * @param {string|number} schoolId
 */
export function useCreateTeacher(schoolId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: data =>
      api.post(`/schools/${schoolId}/teachers`, data).then(res => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teachers', schoolId] });
    },
  });
}

/**
 * Aktualizuje nauczyciela po jego ID.
 * @param {string|number} schoolId
 */
export function useUpdateTeacher(schoolId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: data =>
      api.put(`/teachers/${data.id}`, data).then(res => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teachers', schoolId] });
    },
  });
}

/**
 * Usuwa nauczyciela o danym ID.
 * @param {string|number} schoolId
 */
export function useDeleteTeacher(schoolId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: id => api.delete(`/teachers/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teachers', schoolId] });
    },
  });
}

// src/features/classes/useClasses.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';

/**
 * Pobiera listę klas dla danej szkoły.
 * @param {number|string} schoolId 
 */
export function useClasses(schoolId) {
  return useQuery({
    queryKey: ['classes', schoolId],
    queryFn: () =>
      api
        .get(`/schools/${schoolId}/classes`)
        .then(res => res.data),
    // Nie fetchuj, dopóki nie mamy schoolId
    enabled: !!schoolId,
  });
}

/**
 * Tworzy nową klasę w danej szkole.
 * @param {number|string} schoolId 
 */
export function useCreateClass(schoolId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: data =>
      api
        .post(`/schools/${schoolId}/classes`, data)
        .then(res => res.data),
    onSuccess: () => {
      // odśwież listę klas dla tej szkoły
      qc.invalidateQueries({ queryKey: ['classes', schoolId] });
    },
  });
}

/**
 * Aktualizuje istniejącą klasę po jej ID.
 * @param {number|string} schoolId 
 */
export function useUpdateClass(schoolId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: data =>
      api
        .put(`/classes/${data.id}`, data)
        .then(res => res.data),
    onSuccess: () => {
      // odśwież listę klas dla tej szkoły
      qc.invalidateQueries({ queryKey: ['classes', schoolId] });
    },
  });
}

/**
 * Usuwa klasę o danym ID.
 * @param {number|string} schoolId 
 */
export function useDeleteClass(schoolId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: id =>
      api
        .delete(`/classes/${id}`),
    onSuccess: () => {
      // odśwież listę klas dla tej szkoły
      qc.invalidateQueries({ queryKey: ['classes', schoolId] });
    },
  });
}

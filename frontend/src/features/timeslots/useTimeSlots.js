import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';

/**
 * Fetchuje listę timeslotów dla danej szkoły.
 * @param {number|string} schoolId
 * @param {{ enabled?: boolean }} opts
 */
export function useTimeSlots(schoolId, opts = {}) {
  return useQuery({
    queryKey: ['timeslots', schoolId],
    queryFn: () =>
      api
        .get(`/schools/${schoolId}/timeslots`)
        .then(res => res.data),
    enabled: opts.enabled === true,
  });
}

/**
 * Hook do tworzenia nowego timeslotu.
 * @param {number|string} schoolId
 */
export function useCreateTimeSlot(schoolId) {
  const qc = useQueryClient();
  return useMutation(
    data =>
      api
        .post(`/schools/${schoolId}/timeslots`, data)
        .then(res => res.data),
    {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['timeslots', schoolId] });
      },
    }
  );
}

/**
 * Hook do aktualizacji istniejącego timeslotu.
 * @param {number|string} schoolId
 */
export function useUpdateTimeSlot(schoolId) {
  const qc = useQueryClient();
  return useMutation(
    ({ id, day, hour }) =>
      api
        .put(`/timeslots/${id}`, { day, hour })
        .then(res => res.data),
    {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['timeslots', schoolId] });
      },
    }
  );
}

/**
 * Hook do usuwania timeslotu.
 * @param {number|string} schoolId
 */
export function useDeleteTimeSlot(schoolId) {
  const qc = useQueryClient();
  return useMutation(
    id =>
      api
        .delete(`/timeslots/${id}`)
        .then(res => res.data),
    {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['timeslots', schoolId] });
      },
    }
  );
}

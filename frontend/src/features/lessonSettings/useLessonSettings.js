import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';

export function useLessonSettings(schoolId, opts = {}) {
  return useQuery({
    queryKey: ['lessonSettings', schoolId],
    queryFn: () =>
      api.get(`/schools/${schoolId}/lesson-settings`).then(r => r.data),
    enabled: opts.enabled === true
  });
}

export function useUpdateLessonSettings(schoolId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: data =>
      api.put(`/schools/${schoolId}/lesson-settings`, data).then(r => r.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['lessonSettings', schoolId] })
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';

export function useSchools() {
  return useQuery(['schools'], () =>
    api.get('/schools').then(res => res.data)
  );
}

export function useCreateSchool() {
  const qc = useQueryClient();
  return useMutation(
    newSchool => api.post('/schools', newSchool).then(res => res.data),
    { onSuccess: () => qc.invalidateQueries(['schools']) }
  );
}

export function useUpdateSchool() {
  const qc = useQueryClient();
  return useMutation(
    school => api.put(`/schools/${school.id}`, school).then(res => res.data),
    { onSuccess: () => qc.invalidateQueries(['schools']) }
  );
}

export function useDeleteSchool() {
  const qc = useQueryClient();
  return useMutation(
    id => api.delete(`/schools/${id}`),
    { onSuccess: () => qc.invalidateQueries(['schools']) }
  );
}
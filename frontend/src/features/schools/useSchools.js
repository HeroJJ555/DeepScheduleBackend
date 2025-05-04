import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';

export function useSchools()
{
  return useQuery({
    queryKey: ['schools'],
    queryFn: () => api.get('/schools').then(res => res.data),
  });
}

export function useCreateSchool()
{
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: newSchool =>
      api.post('/schools', newSchool).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
  });
}

export function useUpdateSchool()
{
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: school =>
      api.put(`/schools/${school.id}`, school).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
  });
}

export function useDeleteSchool()
{
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: id => api.delete(`/schools/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
  });
}

// Członkowie
export function useMembers(schoolId, opts = {})
{
  return useQuery({
    queryKey: ['schools', schoolId, 'members'],
    queryFn: () =>
      api.get(`/schools/${schoolId}/users`).then(r => r.data),
    enabled: opts.enabled === true
  });
}

export function useInviteMember(schoolId)
{
  const qc = useQueryClient();
  return useMutation({
    mutationFn: data =>
      api.post(`/schools/${schoolId}/users`, data).then(r => r.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['schools', schoolId, 'members'] })
  });
}

export function useUpdateMember(schoolId)
{
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role, position }) =>
      api.put(`/schools/${schoolId}/users/${userId}`, { role, position })
        .then(r => r.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['schools', schoolId, 'members'] })
  });
}

export function useRemoveMember(schoolId)
{
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userId =>
      api.delete(`/schools/${schoolId}/users/${userId}`),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['schools', schoolId, 'members'] })
  });
}

export function useSchool(schoolId)
{
  return useQuery({
    queryKey: ['schools', schoolId],
    queryFn: () =>
      api.get(`/schools/${schoolId}`).then(r => r.data),
  });
}

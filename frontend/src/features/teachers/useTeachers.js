import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api/client'

export function useTeachers(schoolId, opts = {})
{
  return useQuery({
    queryKey: ['teachers', schoolId],
    queryFn: () =>
      api.get(`/schools/${schoolId}/teachers`).then(res => res.data),
    enabled: opts.enabled
  })
}

export function useCreateTeacher(schoolId)
{
  const qc = useQueryClient()
  return useMutation({
    mutationFn: data =>
      api.post(`/schools/${schoolId}/teachers`, data).then(res => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teachers', schoolId] })
    }
  })
}

export function useUpdateTeacher(schoolId)
{
  const qc = useQueryClient()
  return useMutation({
    mutationFn: data =>
      api.put(`/teachers/${data.id}`, data).then(res => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teachers', schoolId] })
    }
  })
}

export function useDeleteTeacher(schoolId)
{
  const qc = useQueryClient()
  return useMutation({
    mutationFn: id =>
      api.delete(`/teachers/${id}`).then(res => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teachers', schoolId] })
    }
  })
}
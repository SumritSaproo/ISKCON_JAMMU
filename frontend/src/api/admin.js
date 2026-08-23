import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './client';

// ---- Events CRUD (admin) ----
export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => (await api.post('/events', payload)).data.data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] });
      qc.invalidateQueries({ queryKey: ['admin', 'events'] });
    },
  });
}
export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }) => (await api.patch(`/events/${id}`, payload)).data.data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] });
      qc.invalidateQueries({ queryKey: ['admin', 'events'] });
    },
  });
}
export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => (await api.delete(`/events/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
  });
}

// ---- Donations (admin, read-only) ----
export function useAdminDonations(params = {}) {
  return useQuery({
    queryKey: ['admin', 'donations', params],
    queryFn: async () => (await api.get('/donations', { params })).data.data,
  });
}

// ---- Volunteers (admin) ----
export function useAdminVolunteers(params = {}) {
  return useQuery({
    queryKey: ['admin', 'volunteers', params],
    queryFn: async () => (await api.get('/volunteers', { params })).data.data,
  });
}
export function useAdminVolunteerStats() {
  return useQuery({
    queryKey: ['admin', 'volunteers', 'stats'],
    queryFn: async () => (await api.get('/volunteers/stats')).data.data,
  });
}
export function useUpdateVolunteerStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => (await api.patch(`/volunteers/${id}`, { status })).data.data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'volunteers'] });
      qc.invalidateQueries({ queryKey: ['admin', 'volunteers', 'stats'] });
    },
  });
}

export function useAdminGalleryStats() {
  return useQuery({
    queryKey: ['admin', 'gallery', 'stats'],
    queryFn: async () => (await api.get('/gallery/stats')).data.data,
  });
}

// ---- Contact messages (admin) ----
export function useAdminMessages(params = {}) {
  return useQuery({
    queryKey: ['admin', 'messages', params],
    queryFn: async () => (await api.get('/contact', { params })).data.data,
  });
}
export function useUpdateMessageStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => (await api.patch(`/contact/${id}`, { status })).data.data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'messages'] }),
  });
}

// ---- Blog CRUD (admin) ----
export function useCreateBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => (await api.post('/blog', payload)).data.data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blog'] }),
  });
}
export function useDeleteBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => (await api.delete(`/blog/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blog'] }),
  });
}

// ---- Settings (admin write) ----
export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => (await api.patch('/settings', payload)).data.data,
    onSuccess: (settings) => qc.setQueryData(['settings'], settings),
  });
}

export function useUploadBackgroundImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('image', file);
      return (await api.post('/settings/background-image', formData)).data.data;
    },
    onSuccess: (settings) => qc.setQueryData(['settings'], settings),
  });
}

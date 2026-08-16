import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './client';

// ---- Gallery ----
export function useGallery(params = {}) {
  return useQuery({
    queryKey: ['gallery', params],
    queryFn: async () => {
      const { data } = await api.get('/gallery', { params });
      return data.data;
    },
  });
}

export function useUploadGalleryImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gallery'] }),
  });
}

// ---- Blog ----
export function useBlogPosts(params = {}) {
  return useQuery({
    queryKey: ['blog', params],
    queryFn: async () => {
      const { data } = await api.get('/blog', { params });
      return data.data;
    },
  });
}

export function useBlogPost(slug) {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const { data } = await api.get(`/blog/${slug}`);
      return data.data;
    },
    enabled: Boolean(slug),
  });
}

// ---- Settings ----
export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await api.get('/settings');
      return data.data;
    },
  });
}

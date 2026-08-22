import { useQuery } from '@tanstack/react-query';
import api from './client';

export function useUpcomingEvents(category) {
  return useQuery({
    queryKey: ['events', 'upcoming', category],
    queryFn: async () => {
      const { data } = await api.get('/events', { params: { category } });
      return data.data;
    },
  });
}

export function useAdminUpcomingEvents() {
  return useQuery({
    queryKey: ['admin', 'events', 'upcoming'],
    queryFn: async () => (await api.get('/events/admin')).data.data,
  });
}

export function useEvent(slug) {
  return useQuery({
    queryKey: ['events', slug],
    queryFn: async () => {
      const { data } = await api.get(`/events/${slug}`);
      return data.data;
    },
    enabled: Boolean(slug),
  });
}

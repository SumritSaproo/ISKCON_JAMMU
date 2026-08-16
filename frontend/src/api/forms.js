import { useMutation } from '@tanstack/react-query';
import api from './client';

export function useSubmitContact() {
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/contact', payload);
      return data;
    },
  });
}

export function useRegisterVolunteer() {
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/volunteers', payload);
      return data;
    },
  });
}

export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: async (email) => {
      const { data } = await api.post('/newsletter', { email });
      return data;
    },
  });
}

export function useRsvpEvent() {
  return useMutation({
    mutationFn: async ({ eventId, ...payload }) => {
      const { data } = await api.post(`/events/${eventId}/rsvp`, payload);
      return data.data;
    },
  });
}

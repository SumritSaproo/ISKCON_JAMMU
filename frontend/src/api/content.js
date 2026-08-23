import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './client';

export const defaultSiteContent = {
  home: {
    eyebrow: 'Hare Krishna · Welcome',
    title: 'A home for Krishna\nconsciousness in Jammu',
    description:
      'Join us for daily darshan, kirtan and prasadam at ISKCON Jammu — nestled in Dream City, Muthi. All are welcome, every day of the year.',
    primaryCta: "Today's Darshan Timings",
    secondaryCta: 'Plan a Visit',
  },
  about: {
    eyebrow: 'Our Story',
    title: 'About ISKCON Jammu',
    paragraphOne:
      'ISKCON Jammu, situated in Dream City, Muthi, serves as a spiritual home for devotees across the region — offering daily worship, scriptural study and community festivals rooted in the Gaudiya Vaishnava tradition founded by Srila Prabhupada.',
    paragraphTwo:
      'The temple welcomes visitors of every background for darshan, kirtan, and prasadam — with a growing congregation active in seva, youth programs and outreach across Jammu.',
    deitiesHeading: 'Presiding Deities',
    deitiesText: 'Sri Sri Radha Krishna',
    founderHeading: 'Founder-Acharya',
    founderText: 'His Divine Grace A.C. Bhaktivedanta Swami Prabhupada',
  },
  footer: {
    brand: 'ISKCON Jammu',
    description: 'Dream City, Muthi, Jammu, J&K — a home for Krishna consciousness in the region.',
    contactHeading: 'Contact',
    contactText: 'info@iskconjammu.org\n+91 XXXXX XXXXX',
    timingsHeading: 'Daily Timings',
    timingsText: 'Mangala Aarti — 4:30 AM\nSandhya Aarti — 7:00 PM',
    newsletterHeading: 'Newsletter',
    newsletterPlaceholder: 'Your email',
    newsletterButton: 'Join',
    newsletterSuccess: 'Subscribed — thank you!',
  },
};

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

export function useDeleteGalleryImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (imageId) => {
      const { data } = await api.delete(`/gallery/${imageId}`);
      return data;
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
    refetchOnMount: 'always',
  });
}

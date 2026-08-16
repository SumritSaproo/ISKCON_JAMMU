import api from './client';

export async function initiateDonation(payload) {
  const { data } = await api.post('/donations/initiate', payload);
  return data.data; // { orderId, amount, currency, donationId }
}

export async function verifyDonation(payload) {
  const { data } = await api.post('/donations/verify', payload);
  return data.data;
}

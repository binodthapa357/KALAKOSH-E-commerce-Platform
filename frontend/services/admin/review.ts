import { fetchApi } from '@/lib/api';

export interface AdminReview {
  _id: string;
  user_id: {
    _id: string;
    name: string;
    email: string;
  };
  product_id: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export const getReviews = async (): Promise<AdminReview[]> => {
  const data = await fetchApi('/admin/reviews');
  return data.reviews || [];
};

export const deleteReview = async (id: string): Promise<{ success: boolean; message: string }> => {
  return await fetchApi(`/admin/reviews/${id}`, { method: 'DELETE' });
};

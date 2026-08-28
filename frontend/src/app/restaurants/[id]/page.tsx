import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { RestaurantDetail, Restaurant } from './restaurant-detail';

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let restaurant: Restaurant;
  try {
    const response = await api.get<Restaurant>(`/restaurants/${id}`);
    restaurant = response.data;
  } catch {
    notFound();
  }

  return <RestaurantDetail restaurant={restaurant} />;
}

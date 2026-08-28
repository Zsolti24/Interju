'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

type Restaurant = {
  id: number;
  name: string;
  description: string | null;
};

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<Restaurant[]>('/restaurants')
      .then((response) => setRestaurants(response.data))
      .catch(() => setError('Failed to load restaurants'));
  }, []);

  return (
    <main className="p-4">
      <div className="py-3">Restaurants</div>
      {error && <p>{error}</p>}
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id} className="mb-2">
            <Link href={`/restaurants/${restaurant.id}`}>{restaurant.name}</Link>
            {restaurant.description && <p>{restaurant.description}</p>}
          </li>
        ))}
      </ul>
    </main>
  );
}

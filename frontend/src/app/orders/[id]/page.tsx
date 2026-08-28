'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/lib/useRequireAuth';

type OrderItem = {
  id: number;
  quantity: number;
  unitPrice: string;
  menuItem: { id: number; name: string };
};

type Order = {
  id: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export default function OrderPage() {
  useRequireAuth();
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<Order>(`/orders/${params.id}`)
      .then((response) => setOrder(response.data))
      .catch(() => setError('Order not found'));
  }, [params.id]);

  const backButton = (
    <Link href="/restaurants" className="border border-gray-500 px-2 py-1 inline-block">
      Back
    </Link>
  );

  if (error) {
    return (
      <main className="p-4">
        {backButton}
        <p>{error}</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="p-4">
        {backButton}
        <p>Loading...</p>
      </main>
    );
  }

  const total = order.items.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0,
  );

  return (
    <main className="p-4">
      {backButton}
      <div className="py-3">Order #{order.id}</div>
      <p>Status: {order.status}</p>
      <ul className="mt-4">
        {order.items.map((item) => (
          <li key={item.id} className="mb-2">
            {item.menuItem.name} x {item.quantity} - {item.unitPrice}
          </li>
        ))}
      </ul>
      <p>Total: {total}</p>
    </main>
  );
}

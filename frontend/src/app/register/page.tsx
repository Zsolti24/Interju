'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', response.data.accessToken);
      router.push('/restaurants');
    } catch {
      setError('Registration failed');
    }
  }

  return (
    <main className="p-4">
      <div className="py-3">Register</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="border border-gray-500 px-2 py-1 ml-2 mb-2"
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="border border-gray-500 px-2 py-1 ml-2 mb-2"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="border border-gray-500 ml-2 mb-2 px-2 py-1"
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit" className="border border-gray-500 px-2 py-1">
          Register
        </button>
      </form>
      <Link href="/login" className="mt-4 inline-block border border-gray-500 px-2 py-1">
        Login page
      </Link>
    </main>
  );
}

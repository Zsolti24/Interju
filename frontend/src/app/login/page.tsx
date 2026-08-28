'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.accessToken);
      router.push('/restaurants');
    } catch {
      setError('Invalid email or password');
    }
  }

  return (
    <main className="p-4">
      <div className="py-3">Login</div>
      <form onSubmit={handleSubmit}>
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
          Log in
        </button>
      </form>
    </main>
  );
}

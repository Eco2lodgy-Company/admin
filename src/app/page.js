// app/login/page.tsx
'use client'; // Marquez cette page comme un composant client

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    e.preventDefault();

    // Simulation de vérification des identifiants
    if (email === 'user@example.com' && password === 'password') {
      // Définir un cookie d'authentification (exemple simplifié)
      document.cookie = 'authToken=12345; path=/';

      // Redirection vers la page d'accueil après une connexion réussie
      router.push('/dashboard');
    } else {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      {/* <Image src="/back.jpg" alt="Background" layout="fill" objectFit="cover" className="z-0" /> */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md z-10">
        <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          {error && (
            <div className="mb-4 text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
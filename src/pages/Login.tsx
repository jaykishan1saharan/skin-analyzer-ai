import React, { useState } from 'react';
import { Camera } from 'lucide-react';

export default function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Female');
  const [skinType, setSkinType] = useState('Normal');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        const res = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, age: parseInt(age), gender, skin_type: skinType }),
        });
        const data = await res.json();
        if (data.success) {
          onLogin({ id: data.userId, name, email, age, gender, skin_type: skinType });
        } else {
          setError(data.error || 'Registration failed');
        }
      } else {
        const res = await fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (data.success) {
          onLogin(data.user);
        } else {
          setError(data.error || 'Login failed');
        }
      }
    } catch (err: any) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <Camera className="w-8 h-8" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-neutral-900 mb-2">
          {isRegistering ? 'Create an Account' : 'Welcome Back'}
        </h2>
        <p className="text-center text-neutral-500 mb-8">
          {isRegistering ? 'Start your skincare journey today.' : 'Sign in to track your skin health.'}
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="Jane Doe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Skin Type</label>
                <select
                  value={skinType}
                  onChange={(e) => setSkinType(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option>Normal</option>
                  <option>Dry</option>
                  <option>Oily</option>
                  <option>Combination</option>
                  <option>Sensitive</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="jane@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-70"
          >
            {loading ? 'Processing...' : isRegistering ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
          >
            {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

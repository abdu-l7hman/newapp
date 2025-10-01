import React, { useState } from 'react';

export default function Login({ onSuccess }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Non-functional auth: accept any input and continue to app
    setTimeout(() => {
      onSuccess?.({ id: 'local-user', email, displayName, role });
      setLoading(false);
    }, 300);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-center">
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm mb-1">Display name</label>
              <input className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
            </div>
          )}

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input type="password" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-sm mb-1">Role</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="investor">Investor</option>
                <option value="analyst">Analyst</option>
              </select>
            </div>
          )}

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button type="submit" disabled={loading} className="w-full h-10 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Please wait…' : (mode === 'signin' ? 'Continue' : 'Create Account')}
          </button>
        </form>

        <div className="text-center mt-3 text-sm">
          {mode === 'signin' ? (
            <button className="text-blue-600 hover:underline" onClick={() => setMode('signup')}>Need an account? Sign up</button>
          ) : (
            <button className="text-blue-600 hover:underline" onClick={() => setMode('signin')}>Already have an account? Sign in</button>
          )}
        </div>
      </div>
    </div>
  );
}



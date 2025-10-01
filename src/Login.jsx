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
    // Local mock auth: accept any input and continue to app
    setTimeout(() => {
      onSuccess?.({ id: 'local-user', email, displayName, role });
      setLoading(false);
    }, 400);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left visual column */}
        <div className="hidden md:flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white">
          <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center mb-6">
            <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2v20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 16h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold mb-2">Welcome to Investo</h3>
          <p className="text-sm text-white/90 text-center max-w-xs">Discover, evaluate and support student-built projects. Sign in to explore tailored recommendations and investment opportunities.</p>
        </div>

        {/* Right form column */}
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{mode === 'signin' ? 'Sign in to Investo' : 'Create your Investo account'}</h2>
            <p className="text-sm text-gray-500 mt-1">Securely access projects and collaborate with students and investors.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display name</label>
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required placeholder="Your name" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@school.edu" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <div className="flex gap-2">
                  {['student','investor','analyst'].map(r => (
                    <button key={r} type="button" onClick={() => setRole(r)} className={`px-3 py-1.5 rounded-full text-sm font-medium ${role===r ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex items-center justify-between gap-4">
              <button type="submit" disabled={loading} className="flex-1 h-11 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60">
                {loading ? 'Please wait…' : (mode === 'signin' ? 'Continue' : 'Create account')}
              </button>
              <button type="button" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); }} className="text-sm text-gray-600 hover:underline">
                {mode === 'signin' ? 'Need an account?' : 'Have an account?'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-xs text-gray-400">
            By continuing you accept our terms and privacy policy. This is a demo; no real authentication is performed locally.
          </div>
        </div>
      </div>
    </div>
  );
}



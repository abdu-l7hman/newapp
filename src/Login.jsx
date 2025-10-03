import React, { useMemo, useState } from 'react';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';

export default function Login({ onSuccess }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const emailValid = useMemo(() => /.+@.+\..+/.test(email), [email]);
  const passwordScore = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score; // 0..4
  }, [password]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!emailValid) {
      setLoading(false);
      setError('Please enter a valid email address.');
      return;
    }
    if (mode === 'signup' && passwordScore < 2) {
      setLoading(false);
      setError('For signup, please use a stronger password (8+ chars, mix cases/numbers).');
      return;
    }
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
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@school.edu" className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${email.length && !emailValid ? 'border-red-300' : 'border-gray-200'}`} />
              {!emailValid && email.length > 0 && (
                <p className="mt-1 text-xs text-red-600">Invalid email format</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-10 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {mode === 'signup' && (
                <div className="mt-2">
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full transition-all ${passwordScore <= 1 ? 'bg-red-500 w-1/4' : passwordScore === 2 ? 'bg-yellow-500 w-1/2' : passwordScore === 3 ? 'bg-blue-500 w-3/4' : 'bg-green-600 w-full'}`}></div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {password.length === 0 ? 'Enter a password' : passwordScore <= 1 ? 'Weak' : passwordScore === 2 ? 'Okay' : passwordScore === 3 ? 'Good' : 'Strong'}
                  </p>
                </div>
              )}
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <div className="flex gap-2">
                  {['student','investor','analyst'].map(r => (
                    <button key={r} type="button" onClick={() => setRole(r)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${role===r ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
                      <span className="inline-flex items-center gap-1">
                        {role===r && <CheckCircle2 className="h-4 w-4" />}
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex items-center justify-between gap-4">
              <button type="submit" disabled={loading || !emailValid} className="flex-1 h-11 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60 inline-flex items-center justify-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{loading ? 'Please wait…' : (mode === 'signin' ? 'Continue' : 'Create account')}</span>
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



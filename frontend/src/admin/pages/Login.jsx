import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory-dim">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 w-full max-w-sm">
        <div className="font-display font-semibold text-lg text-indigo mb-1">Admin Sign In</div>
        <div className="text-xs text-indigo/60 mb-5">ISKCON Jammu content management</div>

        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-indigo/15 rounded px-3 py-2.5 text-xs mb-2.5"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-indigo/15 rounded px-3 py-2.5 text-xs mb-3"
        />

        {error && <p className="text-[11px] text-vermilion mb-2">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-vermilion text-ivory py-2.5 rounded text-xs font-semibold disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

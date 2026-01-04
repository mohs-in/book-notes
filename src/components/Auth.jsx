import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isSignUp) {
        // Sign Up
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            emailRedirectTo: `${window.location.origin}`,
          },
        });

        if (signUpError) {
          setError(signUpError.message);
        } else if (data?.user) {
          setMessage('✅ Account created! You can now log in.');
          setEmail('');
          setPassword('');
          setIsSignUp(false); // Switch to login
        }
      } else {
        // Sign In
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (signInError) {
          setError(signInError.message);
        } else if (data?.user) {
          setMessage('✅ Logged in successfully!');
          // Session will be set automatically by App.jsx
        }
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <i className="fas fa-book text-blue-600 text-5xl mb-4 block"></i>
          <h1 className="text-3xl font-bold text-gray-900">Book Notes Hub</h1>
          <p className="text-gray-600 mt-2">Take notes while you read</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}

        {/* Success Message */}
        {message && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            <i className="fas fa-check-circle mr-2"></i>
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuth}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-envelope mr-2"></i>Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-lock mr-2"></i>Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength="6"
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Loading...
              </>
            ) : (
              <>
                <i className={`fas fa-${isSignUp ? 'user-plus' : 'sign-in-alt'}`}></i>
                {isSignUp ? 'Create Account' : 'Sign In'}
              </>
            )}
          </button>
        </form>

        {/* Toggle Auth Mode */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setMessage('');
                setEmail('');
                setPassword('');
              }}
              disabled={loading}
              className="text-blue-600 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-gray-600">
          <i className="fas fa-info-circle mr-2 text-blue-600"></i>
          <strong>Test Account:</strong> Use any email and password (min 6 chars) to create one
        </div>
      </div>
    </div>
  );
}

export default Auth;

import { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import Auth from './components/Auth';
import BookNotesApp from './components/BookNotesApp';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check current session
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log('Auth state changed:', session?.user?.email);
        setSession(session);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      console.log('Checking session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
        setError(error.message);
      }
      
      console.log('Session found:', session?.user?.email || 'No user');
      setSession(session);
    } catch (err) {
      console.error('Unexpected error checking session:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Debug: Log render state
  useEffect(() => {
    console.log('App state:', { loading, session: session?.user?.email, error });
  }, [loading, session, error]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-red-600 text-5xl mb-4 block"></i>
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading App</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4 block"></i>
          <p className="text-gray-600 font-medium">Loading your app...</p>
          <p className="text-gray-500 text-sm mt-2">Check browser console for details</p>
        </div>
      </div>
    );
  }

  console.log('Rendering:', session ? 'BookNotesApp' : 'Auth');
  
  return session ? <BookNotesApp user={session.user} /> : <Auth />;
}

export default App;

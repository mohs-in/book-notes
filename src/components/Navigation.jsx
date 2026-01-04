import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function Navigation({ mode, onModeChange, user }) {
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowLogout(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <i className="fas fa-book text-blue-600"></i>
            <span className="hidden sm:inline">Book Notes Hub</span>
            <span className="sm:hidden">Notes</span>
          </h1>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onModeChange(mode === 'view' ? 'editor' : 'view')}
              className={`px-4 py-2 rounded-lg transition font-medium text-sm ${
                mode === 'view'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <i className={`fas fa-${mode === 'view' ? 'eye' : 'edit'} mr-2`}></i>
              <span className="hidden sm:inline">
                {mode === 'view' ? 'View Mode' : 'Editor Mode'}
              </span>
              <span className="sm:hidden">{mode === 'view' ? 'View' : 'Edit'}</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowLogout(!showLogout)}
                className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
              >
                <i className="fas fa-user text-gray-600"></i>
                <span className="hidden sm:inline text-sm text-gray-600">{user?.email}</span>
              </button>

              {showLogout && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-max">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded transition text-sm font-medium"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;

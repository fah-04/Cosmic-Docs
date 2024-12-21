import React, { useState } from 'react';
import { Auth } from './components/Auth';
import { DocumentList } from './components/DocumentList';
import { DocumentEditor } from './components/DocumentEditor';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';
import { FileText } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Animated stars background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjUiIGN5PSI1IiByPSIxIi8+PC9nPjwvc3ZnPg==')] bg-repeat opacity-50"></div>
      </div>

      <nav className="relative bg-gray-900 bg-opacity-50 backdrop-blur-lg border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-purple-400" />
              <h1 className="text-xl font-bold text-white">Cosmic Docs</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-300">{user.email}</span>
              <button
                onClick={() => supabase.auth.signOut()}
                className="px-4 py-2 text-sm text-purple-300 hover:text-purple-200 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <DocumentList onEdit={setEditingDocId} />
      </main>

      {editingDocId && (
        <DocumentEditor
          documentId={editingDocId}
          onClose={() => setEditingDocId(null)}
        />
      )}
    </div>
  );
}

export default App;
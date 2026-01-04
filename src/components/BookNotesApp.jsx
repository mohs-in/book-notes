import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import BookNotesView from './BookNotesView';
import Navigation from './Navigation';

function BookNotesApp({ user }) {
  const [mode, setMode] = useState('view');
  const [books, setBooks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch books on mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error.message);
      alert('Error loading books: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async (bookId) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('book_id', bookId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error.message);
      alert('Error loading notes: ' + error.message);
    }
  };

  const handleAddBook = async () => {
    if (!newBookTitle.trim() || !newBookAuthor.trim()) {
      alert('Please enter both title and author');
      return;
    }

    try {
      setIsSaving(true);
      const { data, error } = await supabase
        .from('books')
        .insert([
          {
            title: newBookTitle,
            author: newBookAuthor,
            user_id: user.id,
          },
        ])
        .select();

      if (error) throw error;
      setBooks([...books, ...data]);
      setNewBookTitle('');
      setNewBookAuthor('');
    } catch (error) {
      console.error('Error adding book:', error.message);
      alert('Error adding book: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Delete this book and all its notes?')) return;

    try {
      setIsSaving(true);
      const { error } = await supabase.from('books').delete().eq('id', bookId);

      if (error) throw error;
      setBooks(books.filter((b) => b.id !== bookId));
      setNotes(notes.filter((n) => n.book_id !== bookId));
      setSelectedBook(null);
    } catch (error) {
      console.error('Error deleting book:', error.message);
      alert('Error deleting book: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectBook = async (book) => {
    setSelectedBook(book);
    await fetchNotes(book.id);
  };

  const handleAddNote = async (noteData) => {
    try {
      setIsSaving(true);
      const { data, error } = await supabase
        .from('notes')
        .insert([
          {
            ...noteData,
            user_id: user.id,
          },
        ])
        .select();

      if (error) throw error;
      setNotes([...data, ...notes]);
    } catch (error) {
      console.error('Error adding note:', error.message);
      alert('Error adding note: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNote = async (updatedNote) => {
    try {
      setIsSaving(true);
      const { data, error } = await supabase
        .from('notes')
        .update({
          title: updatedNote.title,
          content: updatedNote.content,
        })
        .eq('id', updatedNote.id)
        .select();

      if (error) throw error;
      setNotes(notes.map((n) => (n.id === updatedNote.id ? data[0] : n)));
    } catch (error) {
      console.error('Error saving note:', error.message);
      alert('Error saving note: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      setIsSaving(true);
      const { error } = await supabase.from('notes').delete().eq('id', noteId);

      if (error) throw error;
      setNotes(notes.filter((n) => n.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error.message);
      alert('Error deleting note: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (selectedBook) {
    return (
      <>
        <Navigation mode={mode} onModeChange={setMode} user={user} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BookNotesView
            book={selectedBook}
            notes={notes}
            mode={mode}
            onBack={() => setSelectedBook(null)}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
            onAddNote={handleAddNote}
            isLoading={loading}
            isSaving={isSaving}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation mode={mode} onModeChange={setMode} user={user} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Book Section (Editor Mode) */}
        {mode === 'editor' && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Add New Book</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Book title..."
                value={newBookTitle}
                onChange={(e) => setNewBookTitle(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
              />
              <input
                type="text"
                placeholder="Author name..."
                value={newBookAuthor}
                onChange={(e) => setNewBookAuthor(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
              />
              <button
                onClick={handleAddBook}
                disabled={!newBookTitle.trim() || !newBookAuthor.trim() || isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <i className="fas fa-plus mr-2"></i>Add Book
              </button>
            </div>
          </div>
        )}

        {/* Books Grid */}
        {loading ? (
          <div className="text-center py-12">
            <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
            <p className="text-gray-600 mt-2">Loading your books...</p>
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {books.map((book) => {
              const bookNotesCount = notes.filter((n) => n.book_id === book.id).length;
              return (
                <div
                  key={book.id}
                  onClick={() => handleSelectBook(book)}
                  className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-3 gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 break-words">{book.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 truncate">{book.author}</p>
                    </div>
                    {mode === 'editor' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBook(book.id);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition flex-shrink-0"
                      >
                        <i className="fas fa-trash text-sm"></i>
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                      {bookNotesCount} note{bookNotesCount !== 1 ? 's' : ''}
                    </span>
                    <button
                      onClick={() => handleSelectBook(book)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      View <i className="fas fa-arrow-right ml-1"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 sm:p-16 text-center">
            <i className="fas fa-inbox text-gray-300 text-5xl sm:text-6xl mb-4 block"></i>
            <p className="text-gray-600 text-lg">
              No books yet. {mode === 'editor' ? 'Add your first book!' : 'Start adding books to take notes.'}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default BookNotesApp;

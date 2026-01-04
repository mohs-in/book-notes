import { useState } from 'react';
import NoteItem from './NoteItem';
import RichTextEditor from './RichTextEditor';
import { formatDate } from '../lib/utils';

function BookNotesView({
  book,
  notes,
  mode,
  onBack,
  onSaveNote,
  onDeleteNote,
  onAddNote,
  isLoading = false,
  isSaving = false
}) {
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleCreateNote = async () => {
    if (newNoteTitle.trim() && newNoteContent.trim()) {
      await onAddNote({
        title: newNoteTitle,
        content: newNoteContent,
        book_id: book.id
      });
      setNewNoteTitle('');
      setNewNoteContent('');
      setIsCreatingNote(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 mb-6 rounded-lg sticky top-16 z-40 shadow-sm">
        <div className="flex items-start justify-between p-4 sm:p-6 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
            >
              <i className="fas fa-arrow-left text-gray-600"></i>
            </button>
            <div className="min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 break-words">{book.title}</h2>
              <p className="text-sm text-gray-600 mt-1">by {book.author}</p>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full mt-2">
                {notes.length} note{notes.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Create New Note Button (Editor Mode) */}
        {mode === 'editor' && !isCreatingNote && (
          <button
            onClick={() => setIsCreatingNote(true)}
            className="mb-6 w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus"></i> Create New Note
          </button>
        )}

        {/* Create Note Form */}
        {mode === 'editor' && isCreatingNote && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 animate-fadeIn">
            <h3 className="text-lg font-semibold mb-4">Create New Note</h3>
            <input
              type="text"
              placeholder="Note title..."
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:border-blue-600"
            />
            <RichTextEditor
              value={newNoteContent}
              onChange={setNewNoteContent}
              placeholder="Start typing your note..."
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleCreateNote}
                disabled={!newNoteTitle.trim() || !newNoteContent.trim() || isSaving}
                className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Note'}
              </button>
              <button
                onClick={() => {
                  setIsCreatingNote(false);
                  setNewNoteTitle('');
                  setNewNoteContent('');
                }}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Notes List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block">
              <i className="fas fa-spinner fa-spin text-3xl text-blue-600 mb-4"></i>
              <p className="text-gray-600 mt-2">Loading notes...</p>
            </div>
          </div>
        ) : notes.length > 0 ? (
          <div>
            {notes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                isEditor={mode === 'editor'}
                onDelete={onDeleteNote}
                onSave={onSaveNote}
                isSaving={isSaving}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 sm:p-16 text-center">
            <i className="fas fa-book text-gray-300 text-5xl sm:text-6xl mb-4 block"></i>
            <p className="text-gray-600 text-lg">
              No notes yet. {mode === 'editor' ? 'Create your first note!' : 'Start reading and take notes.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookNotesView;

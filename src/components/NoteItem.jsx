import { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import { formatDate } from '../lib/utils';

function NoteItem({ note, isEditor, onDelete, onSave, isSaving = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const handleSave = async () => {
    await onSave({ ...note, title: editTitle, content: editContent });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4 animate-fadeIn">
      <div className="flex justify-between items-start mb-3 gap-4">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-lg font-semibold w-full px-3 py-2 border border-gray-200 rounded mb-2 focus:outline-none focus:border-blue-600"
            />
          ) : (
            <h4 className="text-lg font-semibold text-gray-900 break-words">
              {note.title || 'Untitled Note'}
            </h4>
          )}
          <p className="text-xs text-gray-500 mt-2">
            {formatDate(note.created_at)}
          </p>
        </div>

        {isEditor && (
          <div className="flex gap-2 flex-shrink-0">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                  title="Edit note"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this note?')) {
                      onDelete(note.id);
                    }
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                  title="Delete note"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <RichTextEditor value={editContent} onChange={setEditContent} />
      ) : (
        <div
          className="prose prose-sm max-w-none text-gray-700 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      )}
    </div>
  );
}

export default NoteItem;

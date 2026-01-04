import { useRef, useEffect } from 'react';

function RichTextEditor({ value, onChange, placeholder = "Start typing..." }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  const applyFormat = (command, commandValue = null) => {
    document.execCommand(command, false, commandValue);
    editorRef.current?.focus();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="note-editor border border-gray-200 rounded-lg overflow-hidden">
      <div className="editor-toolbar flex flex-wrap gap-1 p-3 bg-gray-50 border-b border-gray-200">
        <button
          onClick={() => applyFormat('bold')}
          title="Bold (Ctrl+B)"
          className="p-2 bg-white border border-gray-200 rounded hover:bg-blue-600 hover:text-white hover:border-blue-600 transition"
        >
          <i className="fas fa-bold text-sm"></i>
        </button>
        <button
          onClick={() => applyFormat('italic')}
          title="Italic (Ctrl+I)"
          className="p-2 bg-white border border-gray-200 rounded hover:bg-blue-600 hover:text-white hover:border-blue-600 transition"
        >
          <i className="fas fa-italic text-sm"></i>
        </button>
        <button
          onClick={() => applyFormat('underline')}
          title="Underline (Ctrl+U)"
          className="p-2 bg-white border border-gray-200 rounded hover:bg-blue-600 hover:text-white hover:border-blue-600 transition"
        >
          <i className="fas fa-underline text-sm"></i>
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <button
          onClick={() => applyFormat('formatBlock', 'h2')}
          title="Heading"
          className="p-2 bg-white border border-gray-200 rounded hover:bg-blue-600 hover:text-white hover:border-blue-600 transition text-sm"
        >
          <i className="fas fa-heading"></i>
        </button>
        <button
          onClick={() => applyFormat('formatBlock', 'p')}
          title="Paragraph"
          className="p-2 bg-white border border-gray-200 rounded hover:bg-blue-600 hover:text-white hover:border-blue-600 transition text-sm"
        >
          <i className="fas fa-paragraph"></i>
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <button
          onClick={() => applyFormat('insertUnorderedList')}
          title="Bullet List"
          className="p-2 bg-white border border-gray-200 rounded hover:bg-blue-600 hover:text-white hover:border-blue-600 transition"
        >
          <i className="fas fa-list-ul text-sm"></i>
        </button>
        <button
          onClick={() => applyFormat('insertOrderedList')}
          title="Numbered List"
          className="p-2 bg-white border border-gray-200 rounded hover:bg-blue-600 hover:text-white hover:border-blue-600 transition"
        >
          <i className="fas fa-list-ol text-sm"></i>
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <button
          onClick={() => applyFormat('createLink', prompt('Enter URL:'))}
          title="Add Link"
          className="p-2 bg-white border border-gray-200 rounded hover:bg-blue-600 hover:text-white hover:border-blue-600 transition"
        >
          <i className="fas fa-link text-sm"></i>
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <button
          onClick={() => applyFormat('undo')}
          title="Undo"
          className="p-2 bg-white border border-gray-200 rounded hover:bg-blue-600 hover:text-white hover:border-blue-600 transition"
        >
          <i className="fas fa-undo text-sm"></i>
        </button>
        <button
          onClick={() => applyFormat('redo')}
          title="Redo"
          className="p-2 bg-white border border-gray-200 rounded hover:bg-blue-600 hover:text-white hover:border-blue-600 transition"
        >
          <i className="fas fa-redo text-sm"></i>
        </button>

        <button
          onClick={() => applyFormat('removeFormat')}
          title="Clear Formatting"
          className="p-2 bg-white border border-gray-200 rounded hover:bg-blue-600 hover:text-white hover:border-blue-600 transition text-sm"
        >
          <i className="fas fa-eraser"></i>
        </button>
      </div>

      <div
        ref={editorRef}
        className="editor-content bg-white min-h-96 p-4 outline-none focus:outline-2 focus:outline-blue-600 focus:outline-offset-[-2px] leading-relaxed"
        onInput={handleInput}
        suppressContentEditableWarning={true}
        contentEditable={true}
        data-placeholder={placeholder}
      />
    </div>
  );
}

export default RichTextEditor;

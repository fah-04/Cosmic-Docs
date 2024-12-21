import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';

interface DocumentEditorProps {
  documentId: string;
  onClose: () => void;
}

export function DocumentEditor({ documentId, onClose }: DocumentEditorProps) {
  const { getDocument, createDocument, updateDocument } = useDocuments();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (documentId !== 'new') {
      const loadDocument = async () => {
        const doc = await getDocument(documentId);
        if (doc) {
          setTitle(doc.title);
          setContent(doc.content);
        }
      };
      loadDocument();
    }
  }, [documentId, getDocument]);

  const handleSave = async () => {
    if (!title.trim()) return;

    if (documentId === 'new') {
      await createDocument({ title, content });
    } else {
      await updateDocument(documentId, { title, content });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-xl flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl bg-gray-900 rounded-lg shadow-2xl border border-purple-500/30">
        <div className="flex items-center justify-between p-4 border-b border-purple-500/30">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document Title"
            className="bg-transparent text-xl font-semibold text-white placeholder-gray-500 focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-200"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="w-full h-[70vh] p-4 bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none"
        />
      </div>
    </div>
  );
}
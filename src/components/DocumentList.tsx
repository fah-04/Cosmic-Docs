import React from 'react';
import { FileText, Plus, Trash2, Edit2, Loader2 } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';

export function DocumentList({ onEdit }: { onEdit: (id: string) => void }) {
  const { documents, isLoading, error, deleteDocument } = useDocuments();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Your Documents</h2>
        <button
          onClick={() => onEdit('new')}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          New Document
        </button>
      </div>
      
      {documents.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <p className="text-gray-400">No documents yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="relative group bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 border border-purple-500/30 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white truncate">{doc.title}</h3>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(doc.id)}
                    className="p-1 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-gray-400 text-sm line-clamp-3">
                {doc.content || 'No content'}
              </p>
              <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                {new Date(doc.updated_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
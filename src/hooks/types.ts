export interface Document {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
}

export interface DocumentState {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
}

export interface DocumentOperations {
  getDocument: (id: string) => Promise<Document | null>;
  createDocument: (data: { title: string; content: string }) => Promise<Document | null>;
  updateDocument: (id: string, data: { title: string; content: string }) => Promise<Document | null>;
  deleteDocument: (id: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}
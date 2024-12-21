import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Document, DocumentState, DocumentOperations } from './types';
import { handleError } from '../utils/error';

export function useDocuments(): DocumentState & DocumentOperations {
  const [state, setState] = useState<DocumentState>({
    documents: [],
    isLoading: true,
    error: null
  });

  const fetchDocuments = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'User not authenticated' 
      }));
      return;
    }

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('owner_id', user.user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      handleError('Error fetching documents:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to fetch documents' 
      }));
      return;
    }

    setState({
      documents: data,
      isLoading: false,
      error: null
    });
  }, []);

  const getDocument = async (id: string) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return null;

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .eq('owner_id', user.user.id)
      .single();

    if (error) {
      handleError('Error fetching document:', error);
      return null;
    }

    return data;
  };

  const createDocument = async ({ title, content }: { title: string; content: string }) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return null;

    const { data, error } = await supabase
      .from('documents')
      .insert([{ 
        title, 
        content, 
        owner_id: user.user.id 
      }])
      .select()
      .single();

    if (error) {
      handleError('Error creating document:', error);
      return null;
    }

    await fetchDocuments();
    return data;
  };

  const updateDocument = async (id: string, { title, content }: { title: string; content: string }) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return null;

    const { data, error } = await supabase
      .from('documents')
      .update({ 
        title, 
        content, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .eq('owner_id', user.user.id)
      .select()
      .single();

    if (error) {
      handleError('Error updating document:', error);
      return null;
    }

    await fetchDocuments();
    return data;
  };

  const deleteDocument = async (id: string) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return false;

    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.user.id);

    if (error) {
      handleError('Error deleting document:', error);
      return false;
    }

    await fetchDocuments();
    return true;
  };

  useEffect(() => {
    fetchDocuments();

    const channel = supabase
      .channel('documents_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'documents' },
        fetchDocuments
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchDocuments]);

  return {
    ...state,
    getDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    refresh: fetchDocuments
  };
}
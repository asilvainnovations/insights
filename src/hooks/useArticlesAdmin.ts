import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Article, ArticleStatus, Category, Profile } from '@/types';
import { toast } from '@/hooks/use-toast';

interface UseArticlesAdminOptions {
  status?: ArticleStatus | 'all';
  category?: Category | null;
  authorId?: string;
  searchQuery?: string;
  limit?: number;
}

interface UseArticlesAdminReturn {
  articles: Article[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
  deleteArticle: (id: string) => Promise<boolean>;
  bulkUpdateStatus: (ids: string[], status: ArticleStatus) => Promise<boolean>;
  duplicateArticle: (id: string) => Promise<Article | null>;
}

export function useArticlesAdmin(options: UseArticlesAdminOptions = {}): UseArticlesAdminReturn {
  const { status = 'all', category, authorId, searchQuery, limit = 20 } = options;
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchArticles = useCallback(async (pageNum: number, append = false) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('articles')
        .select(`
          *,
          author:profiles(
            id,
            full_name,
            avatar_url,
            role
          )
        `)
        .order('updated_at', { ascending: false })
        .range(pageNum * limit, (pageNum + 1) * limit - 1);

      if (status !== 'all') {
        query = query.eq('status', status);
      }

      if (category) {
        query = query.eq('category', category);
      }

      if (authorId) {
        query = query.eq('author_id', authorId);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const formattedArticles = (data || []).map((article: any) => ({
        ...article,
        author: article.author,
      }));

      if (append) {
        setArticles(prev => [...prev, ...formattedArticles]);
      } else {
        setArticles(formattedArticles);
      }

      setHasMore(formattedArticles.length === limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  }, [status, category, authorId, searchQuery, limit]);

  useEffect(() => {
    setPage(0);
    fetchArticles(0, false);
  }, [status, category, authorId, searchQuery, fetchArticles]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchArticles(nextPage, true);
    }
  }, [loading, hasMore, page, fetchArticles]);

  const refetch = useCallback(() => {
    setPage(0);
    fetchArticles(0, false);
  }, [fetchArticles]);

  const deleteArticle = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setArticles(prev => prev.filter(a => a.id !== id));
      toast({ title: 'Article deleted' });
      return true;
    } catch (err) {
      toast({
        title: 'Error deleting article',
        description: (err as Error).message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const bulkUpdateStatus = async (ids: string[], status: ArticleStatus): Promise<boolean> => {
    try {
      const updates = ids.map(id => ({
        id,
        status,
        updated_at: new Date().toISOString(),
        ...(status === 'published' ? { published_at: new Date().toISOString() } : {}),
      }));

      const { error } = await supabase
        .from('articles')
        .upsert(updates);

      if (error) throw error;

      setArticles(prev => prev.map(a => 
        ids.includes(a.id) ? { ...a, status } : a
      ));

      toast({ title: `${ids.length} articles updated` });
      return true;
    } catch (err) {
      toast({
        title: 'Error updating articles',
        description: (err as Error).message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const duplicateArticle = async (id: string): Promise<Article | null> => {
    try {
      const { data: original, error: fetchError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const { id: _, slug, created_at, updated_at, published_at, views, ...articleData } = original;

      const newArticle = {
        ...articleData,
        title: `${original.title} (Copy)`,
        slug: `${original.slug}-copy-${Date.now()}`,
        status: 'draft' as ArticleStatus,
        views: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error: insertError } = await supabase
        .from('articles')
        .insert([newArticle])
        .select()
        .single();

      if (insertError) throw insertError;

      setArticles(prev => [data, ...prev]);
      toast({ title: 'Article duplicated' });
      return data;
    } catch (err) {
      toast({
        title: 'Error duplicating article',
        description: (err as Error).message,
        variant: 'destructive',
      });
      return null;
    }
  };

  return {
    articles,
    loading,
    error,
    hasMore,
    loadMore,
    refetch,
    deleteArticle,
    bulkUpdateStatus,
    duplicateArticle,
  };
}

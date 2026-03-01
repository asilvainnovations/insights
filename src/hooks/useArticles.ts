import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Article, Profile, Category } from '@/types';

interface UseArticlesOptions {
  category?: Category | null;
  searchQuery?: string;
  limit?: number;
  featured?: boolean;
}

interface UseArticlesReturn {
  articles: Article[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
}

export function useArticles(options: UseArticlesOptions = {}): UseArticlesReturn {
  const { category, searchQuery, limit = 12, featured } = options;
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
            role,
            bio,
            social_links
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(pageNum * limit, (pageNum + 1) * limit - 1);

      if (category) {
        query = query.eq('category', category);
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
  }, [category, searchQuery, limit]);

  useEffect(() => {
    setPage(0);
    fetchArticles(0, false);
  }, [category, searchQuery, fetchArticles]);

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

  return { articles, loading, error, hasMore, loadMore, refetch };
}

export function useArticle(slug: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('articles')
          .select(`
            *,
            author:profiles(
              id,
              full_name,
              avatar_url,
              role,
              bio,
              social_links
            )
          `)
          .eq('slug', slug)
          .single();

        if (fetchError) throw fetchError;

        setArticle({
          ...data,
          author: data.author,
        });

        // Increment view count
        await supabase
          .from('articles')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', data.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch article');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  return { article, loading, error };
}

export function useRelatedArticles(articleId: string, category: Category, limit = 4) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      try {
        const { data } = await supabase
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
          .eq('status', 'published')
          .eq('category', category)
          .neq('id', articleId)
          .order('views', { ascending: false })
          .limit(limit);

        setArticles((data || []).map((article: any) => ({
          ...article,
          author: article.author,
        })));
      } catch (err) {
        console.error('Failed to fetch related articles:', err);
      } finally {
        setLoading(false);
      }
    }

    if (articleId && category) {
      fetchRelated();
    }
  }, [articleId, category, limit]);

  return { articles, loading };
}

export function useAuthors() {
  const [authors, setAuthors] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuthors() {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .order('full_name');

        setAuthors(data || []);
      } catch (err) {
        console.error('Failed to fetch authors:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAuthors();
  }, []);

  return { authors, loading };
}
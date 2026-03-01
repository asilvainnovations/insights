import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Article } from '@/types';
import ArticleCard from './ArticleCard';

interface BookmarksPageProps {
  onArticleClick: (slug: string) => void;
}

export default function BookmarksPage({ onArticleClick }: BookmarksPageProps) {
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  const fetchBookmarks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          article_id,
          created_at,
          articles (
            *,
            author:authors(*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const articles = data
        ?.map((b: any) => b.articles)
        .filter(Boolean) as Article[];

      setBookmarks(articles || []);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (articleId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('article_id', articleId);

      if (error) throw error;

      setBookmarks(bookmarks.filter(b => b.id !== articleId));
    } catch (err) {
      console.error('Error removing bookmark:', err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view bookmarks</h1>
          <p className="text-gray-600">You need to be signed in to save and view your bookmarked articles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-blue-600" />
            My Bookmarks
          </h1>
          <p className="text-gray-600 mt-2">
            Articles you've saved for later reading
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-16">
            <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No bookmarks yet</h2>
            <p className="text-gray-600">
              Start saving articles by clicking the bookmark icon on any article.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((article) => (
              <div key={article.id} className="relative group">
                <ArticleCard
                  article={article}
                  onClick={onArticleClick}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBookmark(article.id);
                  }}
                  className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Hook to manage bookmarks
export function useBookmarks() {
  const { user } = useAuth();
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBookmarkedIds();
    } else {
      setBookmarkedIds(new Set());
    }
  }, [user]);

  const fetchBookmarkedIds = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('article_id')
        .eq('user_id', user.id);

      if (error) throw error;

      setBookmarkedIds(new Set(data?.map(b => b.article_id) || []));
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    }
  };

  const toggleBookmark = async (articleId: string) => {
    if (!user) return false;

    setLoading(true);
    try {
      if (bookmarkedIds.has(articleId)) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('article_id', articleId);

        if (error) throw error;

        setBookmarkedIds(prev => {
          const next = new Set(prev);
          next.delete(articleId);
          return next;
        });
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('bookmarks')
          .insert({ user_id: user.id, article_id: articleId });

        if (error) throw error;

        setBookmarkedIds(prev => new Set([...prev, articleId]));
      }
      return true;
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isBookmarked = (articleId: string) => bookmarkedIds.has(articleId);

  return { isBookmarked, toggleBookmark, loading };
}

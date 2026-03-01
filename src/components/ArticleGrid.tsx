import React, { useEffect, useRef, useCallback } from 'react';
import ArticleCard from './ArticleCard';
import { Article, Category } from '@/types';
import { Loader2 } from 'lucide-react';

interface ArticleGridProps {
  articles: Article[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onArticleClick: (slug: string) => void;
  searchQuery?: string;
  selectedCategory?: Category | null;
}

export default function ArticleGrid({
  articles,
  loading,
  hasMore,
  onLoadMore,
  onArticleClick,
  searchQuery,
  selectedCategory,
}: ArticleGridProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Infinite scroll observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasMore && !loading) {
      onLoadMore();
    }
  }, [hasMore, loading, onLoadMore]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  // Skeleton loader
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-5">
        <div className="flex gap-3 mb-3">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
        <div className="h-6 bg-gray-200 rounded mb-2" />
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );

  const featuredArticle = articles[0];
  const gridArticles = articles.slice(1);

  if (loading && articles.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Skeleton */}
          <div className="mb-12 animate-pulse">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="grid md:grid-cols-5 gap-0">
                <div className="md:col-span-3 h-64 md:h-96 bg-gray-200" />
                <div className="md:col-span-2 p-8">
                  <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
                  <div className="h-8 bg-gray-200 rounded mb-2" />
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-20 bg-gray-200 rounded mb-6" />
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full" />
                    <div>
                      <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                      <div className="h-3 w-20 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0 && !loading) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">
              {searchQuery 
                ? `No results for "${searchQuery}". Try a different search term.`
                : selectedCategory
                  ? `No articles in ${selectedCategory} yet. Check back soon!`
                  : 'No articles available at the moment.'
              }
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {selectedCategory || 'Latest Articles'}
            </h2>
            <p className="text-gray-600 mt-2">
              {searchQuery 
                ? `Showing results for "${searchQuery}"`
                : `Discover insights and strategies for organizational excellence`
              }
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {articles.length} article{articles.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Featured Article */}
        {featuredArticle && !searchQuery && (
          <div className="mb-12">
            <ArticleCard 
              article={featuredArticle} 
              onClick={onArticleClick}
              variant="featured"
            />
          </div>
        )}

        {/* Article Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(searchQuery ? articles : gridArticles).map((article, index) => (
            <div 
              key={article.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ArticleCard 
                article={article} 
                onClick={onArticleClick}
              />
            </div>
          ))}

          {/* Loading more skeletons */}
          {loading && articles.length > 0 && (
            <>
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={`loading-${i}`} />
              ))}
            </>
          )}
        </div>

        {/* Load More Trigger */}
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center mt-8">
          {loading && articles.length > 0 && (
            <div className="flex items-center gap-3 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading more articles...</span>
            </div>
          )}
          {!hasMore && articles.length > 0 && (
            <p className="text-gray-500 text-center">
              You've reached the end. Check back for new articles!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

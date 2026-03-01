import React, { useState, useEffect } from 'react';
import { Clock, Eye, ArrowRight, Bookmark, Share2, Loader2 } from 'lucide-react';
import { Article, CATEGORY_COLORS, Category } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useBookmarks } from './BookmarksPage';

interface ArticleCardProps {
  article: Article;
  onClick: (slug: string) => void;
  variant?: 'default' | 'featured' | 'compact';
}

export default function ArticleCard({ article, onClick, variant = 'default' }: ArticleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  
  const bookmarked = isBookmarked(article.id);
  const categoryColors = CATEGORY_COLORS[article.category as Category] || CATEGORY_COLORS['Systems Innovations'];

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      // Could trigger auth modal here
      return;
    }
    
    setBookmarkLoading(true);
    await toggleBookmark(article.id);
    setBookmarkLoading(false);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.origin + '/article/' + article.slug,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + '/article/' + article.slug);
    }
  };

  if (variant === 'featured') {
    return (
      <article 
        className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
        onClick={() => onClick(article.slug)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="grid md:grid-cols-5 gap-0">
          {/* Image - 3 columns */}
          <div className="md:col-span-3 relative h-64 md:h-full min-h-[300px] overflow-hidden">
            <img 
              src={article.featured_image} 
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            
            {/* Category Badge */}
            <div className="absolute top-6 left-6">
              <span 
                className="px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg"
                style={{ backgroundColor: categoryColors.accent }}
              >
                {article.category}
              </span>
            </div>

            {/* Actions */}
            <div className="absolute top-6 right-6 flex gap-2">
              <button 
                onClick={handleBookmark}
                disabled={bookmarkLoading}
                className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                  bookmarked ? 'bg-blue-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {bookmarkLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
                )}
              </button>
              <button 
                onClick={handleShare}
                className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content - 2 columns */}
          <div className="md:col-span-2 p-8 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4 text-gray-500 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.reading_time} min
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {article.views.toLocaleString()}
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-3">
              {article.title}
            </h2>

            <p className="text-gray-600 mb-6 line-clamp-3">
              {article.excerpt}
            </p>

            {/* Author */}
            {article.author && (
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src={article.author.avatar} 
                  alt={article.author.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                />
                <div>
                  <p className="font-semibold text-gray-900">{article.author.name}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(article.published_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-4 transition-all">
              Read Full Article
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article 
        className="group flex gap-4 cursor-pointer"
        onClick={() => onClick(article.slug)}
      >
        <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
          <img 
            src={article.featured_image} 
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span 
            className="text-xs font-semibold"
            style={{ color: categoryColors.accent }}
          >
            {article.category}
          </span>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mt-1">
            {article.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {article.reading_time} min read
          </p>
        </div>
      </article>
    );
  }

  // Default variant
  return (
    <article 
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
      onClick={() => onClick(article.slug)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={article.featured_image} 
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span 
            className="px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: categoryColors.accent }}
          >
            {article.category}
          </span>
        </div>

        {/* Actions on Hover */}
        <div className={`absolute top-4 right-4 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <button 
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              bookmarked ? 'bg-blue-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            {bookmarkLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            )}
          </button>
          <button 
            onClick={handleShare}
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white transition-all"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Excerpt on Hover */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-white text-sm line-clamp-2">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3 text-gray-500 text-xs">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {article.reading_time} min
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {article.views.toLocaleString()}
          </span>
          <span>
            {new Date(article.published_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 text-lg">
          {article.title}
        </h3>

        {/* Author */}
        {article.author && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <img 
              src={article.author.avatar} 
              alt={article.author.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm text-gray-600 font-medium">{article.author.name}</span>
          </div>
        )}
      </div>
    </article>
  );
}

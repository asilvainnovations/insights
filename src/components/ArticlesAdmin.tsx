import React, { useState } from 'react';
import {
  Plus, Search, Filter, MoreVertical, Edit, Trash2, Copy, Eye,
  CheckCircle, Clock, AlertCircle, Calendar, ChevronDown, Loader2
} from 'lucide-react';
import { useArticlesAdmin } from '@/hooks/useArticlesAdmin';
import { Article, ArticleStatus, Category, CATEGORIES } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface ArticlesAdminProps {
  onEdit: (article: Article) => void;
  onCreate: () => void;
}

const STATUS_FILTERS: { value: ArticleStatus | 'all'; label: string; icon: any; color: string }[] = [
  { value: 'all', label: 'All Articles', icon: Filter, color: 'text-gray-600' },
  { value: 'published', label: 'Published', icon: CheckCircle, color: 'text-green-600' },
  { value: 'draft', label: 'Drafts', icon: Clock, color: 'text-gray-600' },
  { value: 'scheduled', label: 'Scheduled', icon: Calendar, color: 'text-amber-600' },
  { value: 'archived', label: 'Archived', icon: AlertCircle, color: 'text-red-600' },
];

export default function ArticlesAdmin({ onEdit, onCreate }: ArticlesAdminProps) {
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const {
    articles,
    loading,
    error,
    hasMore,
    loadMore,
    refetch,
    deleteArticle,
    bulkUpdateStatus,
    duplicateArticle,
  } = useArticlesAdmin({
    status: statusFilter,
    category: categoryFilter,
    searchQuery: searchQuery || undefined,
  });

  const toggleSelection = (id: string) => {
    setSelectedArticles(prev => 
      prev.includes(id) 
        ? prev.filter(a => a !== id)
        : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedArticles.length === articles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(articles.map(a => a.id));
    }
  };

  const handleBulkPublish = async () => {
    await bulkUpdateStatus(selectedArticles, 'published');
    setSelectedArticles([]);
    setShowBulkActions(false);
  };

  const handleBulkDraft = async () => {
    await bulkUpdateStatus(selectedArticles, 'draft');
    setSelectedArticles([]);
    setShowBulkActions(false);
  };

  const handleBulkDelete = async () => {
    if (confirm(`Delete ${selectedArticles.length} articles? This cannot be undone.`)) {
      for (const id of selectedArticles) {
        await deleteArticle(id);
      }
      setSelectedArticles([]);
      setShowBulkActions(false);
    }
  };

  const getStatusBadge = (status: ArticleStatus) => {
    const styles = {
      published: 'bg-green-100 text-green-700',
      draft: 'bg-gray-100 text-gray-700',
      scheduled: 'bg-amber-100 text-amber-700',
      archived: 'bg-red-100 text-red-700',
    };
    
    return (
      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', styles[status])}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
            <p className="text-gray-600 mt-1">Manage your content</p>
          </div>
          <button
            onClick={onCreate}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Article
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ArticleStatus | 'all')}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10"
              >
                {STATUS_FILTERS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={categoryFilter || ''}
                onChange={(e) => setCategoryFilter(e.target.value as Category || null)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedArticles.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {selectedArticles.length} selected
              </span>
              <button
                onClick={handleBulkPublish}
                className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200"
              >
                Publish
              </button>
              <button
                onClick={handleBulkDraft}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
              >
                Move to Drafts
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedArticles.length === articles.length && articles.length > 0}
                    onChange={toggleAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Article</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Author</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Views</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedArticles.includes(article.id)}
                      onChange={() => toggleSelection(article.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {article.featured_image && (
                        <img
                          src={article.featured_image}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">{article.title}</h3>
                        <p className="text-sm text-gray-500">{article.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {article.author?.avatar_url && (
                        <img
                          src={article.author.avatar_url}
                          alt=""
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <span className="text-sm text-gray-700">{article.author?.full_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(article.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {format(new Date(article.updated_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {article.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/article/${article.slug}`}
                        target="_blank"
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => onEdit(article)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => duplicateArticle(article.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteArticle(article.id)}
                        className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
            </div>
          )}

          {!loading && articles.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-500">No articles found</p>
            </div>
          )}

          {hasMore && !loading && (
            <div className="p-4 border-t border-gray-200 text-center">
              <button
                onClick={loadMore}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

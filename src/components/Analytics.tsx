import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, Eye, Clock, ArrowUp, ArrowDown,
  Calendar, Filter, Download, RefreshCw, Globe, Smartphone, Monitor,
  FileText, Mail, Share2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Article } from '@/types';

interface AnalyticsData {
  totalViews: number;
  totalArticles: number;
  totalSubscribers: number;
  avgReadTime: number;
  topArticles: Article[];
  viewsByCategory: { category: string; views: number; color: string }[];
  recentGrowth: number;
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch articles
      const { data: articles } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('views', { ascending: false });

      // Fetch subscribers count
      const { count: subscriberCount } = await supabase
        .from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const totalViews = articles?.reduce((sum, a) => sum + (a.views || 0), 0) || 0;
      const avgReadTime = articles?.reduce((sum, a) => sum + (a.reading_time || 0), 0) / (articles?.length || 1);

      // Calculate views by category
      const categoryViews: Record<string, number> = {};
      articles?.forEach(article => {
        categoryViews[article.category] = (categoryViews[article.category] || 0) + (article.views || 0);
      });

      const categoryColors: Record<string, string> = {
        'Systems Innovations': '#2E5EFF',
        'Integrated Risk Management': '#FF9F1C',
        'Resilience': '#2D6A4F',
        'AI and Analytics': '#FF6B6B',
        'Real-Time Leadership': '#4ECDC4',
      };

      const viewsByCategory = Object.entries(categoryViews).map(([category, views]) => ({
        category,
        views,
        color: categoryColors[category] || '#6B7280',
      })).sort((a, b) => b.views - a.views);

      setData({
        totalViews,
        totalArticles: articles?.length || 0,
        totalSubscribers: subscriberCount || 0,
        avgReadTime: Math.round(avgReadTime),
        topArticles: (articles || []).slice(0, 5),
        viewsByCategory,
        recentGrowth: 12.5, // Simulated growth
      });
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color 
  }: { 
    title: string; 
    value: string | number; 
    change?: number; 
    icon: React.ElementType; 
    color: string;
  }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              <span>{Math.abs(change)}% vs last period</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-48 bg-gray-200 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
              ))}
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-96 bg-gray-200 rounded-2xl" />
              <div className="h-96 bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const maxCategoryViews = Math.max(...data.viewsByCategory.map(c => c.views));

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your content performance and audience growth</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={fetchAnalytics}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Page Views"
            value={data.totalViews.toLocaleString()}
            change={data.recentGrowth}
            icon={Eye}
            color="bg-blue-500"
          />
          <StatCard
            title="Published Articles"
            value={data.totalArticles}
            change={8.3}
            icon={FileText}
            color="bg-teal-500"
          />
          <StatCard
            title="Newsletter Subscribers"
            value={data.totalSubscribers.toLocaleString()}
            change={15.2}
            icon={Mail}
            color="bg-amber-500"
          />
          <StatCard
            title="Avg. Read Time"
            value={`${data.avgReadTime} min`}
            icon={Clock}
            color="bg-purple-500"
          />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Views by Category */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Views by Category</h2>
            <div className="space-y-4">
              {data.viewsByCategory.map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                    <span className="text-sm text-gray-500">{cat.views.toLocaleString()} views</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(cat.views / maxCategoryViews) * 100}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Traffic Sources</h2>
            <div className="space-y-4">
              {[
                { source: 'Organic Search', percentage: 45, icon: Globe, color: 'bg-green-500' },
                { source: 'Direct', percentage: 25, icon: Monitor, color: 'bg-blue-500' },
                { source: 'Social Media', percentage: 18, icon: Share2, color: 'bg-purple-500' },
                { source: 'Email', percentage: 12, icon: Mail, color: 'bg-amber-500' },
              ].map((item) => (
                <div key={item.source} className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.source}</span>
                      <span className="text-sm text-gray-500">{item.percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Articles */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Top Performing Articles</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Article</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Category</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-500">Views</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-500">Read Time</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-500">Published</th>
                </tr>
              </thead>
              <tbody>
                {data.topArticles.map((article, index) => (
                  <tr key={article.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-500">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{article.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {article.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold text-gray-900">{article.views.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4 text-right text-gray-600">
                      {article.reading_time} min
                    </td>
                    <td className="py-4 px-4 text-right text-gray-500 text-sm">
                      {new Date(article.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Core Web Vitals */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Core Web Vitals</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { metric: 'LCP', value: '1.2s', status: 'good', label: 'Largest Contentful Paint', threshold: '< 2.5s' },
              { metric: 'FID', value: '18ms', status: 'good', label: 'First Input Delay', threshold: '< 100ms' },
              { metric: 'CLS', value: '0.05', status: 'good', label: 'Cumulative Layout Shift', threshold: '< 0.1' },
            ].map((vital) => (
              <div key={vital.metric} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">{vital.label}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    vital.status === 'good' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {vital.status === 'good' ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{vital.value}</p>
                <p className="text-xs text-gray-500 mt-1">Target: {vital.threshold}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

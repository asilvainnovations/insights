import React, { useState } from 'react';
import { Twitter, Linkedin, Facebook, Link2, Mail, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  articleId?: string;
  variant?: 'horizontal' | 'vertical';
  showLabels?: boolean;
}

export default function SocialShare({
  url,
  title,
  description = '',
  articleId,
  variant = 'horizontal',
  showLabels = false,
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const trackShare = async (platform: string) => {
    if (articleId) {
      try {
        await supabase.from('analytics_events').insert({
          event_type: 'share',
          article_id: articleId,
          page_path: url,
          referrer: platform,
        });
      } catch (err) {
        console.error('Failed to track share:', err);
      }
    }
  };

  const shareOptions = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'hover:bg-blue-400 hover:text-white',
      onClick: () => {
        trackShare('twitter');
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
          '_blank',
          'width=550,height=435'
        );
      },
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'hover:bg-blue-700 hover:text-white',
      onClick: () => {
        trackShare('linkedin');
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          '_blank',
          'width=550,height=435'
        );
      },
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-blue-600 hover:text-white',
      onClick: () => {
        trackShare('facebook');
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank',
          'width=550,height=435'
        );
      },
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'hover:bg-gray-700 hover:text-white',
      onClick: () => {
        trackShare('email');
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
          `${description}\n\nRead more: ${url}`
        )}`;
      },
    },
    {
      name: 'Copy Link',
      icon: copied ? CheckCircle : Link2,
      color: copied ? 'bg-green-500 text-white' : 'hover:bg-gray-700 hover:text-white',
      onClick: async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          trackShare('copy');
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      },
    },
  ];

  const containerClass = variant === 'vertical' 
    ? 'flex flex-col gap-2' 
    : 'flex items-center gap-2';

  return (
    <div className={containerClass}>
      {shareOptions.map((option) => (
        <button
          key={option.name}
          onClick={option.onClick}
          className={`p-2.5 rounded-full bg-gray-100 text-gray-600 transition-all duration-200 ${option.color} ${
            showLabels ? 'flex items-center gap-2 px-4' : ''
          }`}
          title={option.name}
          aria-label={`Share on ${option.name}`}
        >
          <option.icon className="w-5 h-5" />
          {showLabels && <span className="text-sm font-medium">{option.name}</span>}
        </button>
      ))}
    </div>
  );
}

// Floating share bar component
export function FloatingShareBar({
  url,
  title,
  description,
  articleId,
}: Omit<SocialShareProps, 'variant' | 'showLabels'>) {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 animate-fadeIn hidden lg:block">
      <div className="bg-white rounded-full shadow-lg p-2 border border-gray-100">
        <SocialShare
          url={url}
          title={title}
          description={description}
          articleId={articleId}
          variant="vertical"
        />
      </div>
    </div>
  );
}

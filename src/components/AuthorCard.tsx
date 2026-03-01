import React from 'react';
import { Linkedin, Twitter, Globe, Mail } from 'lucide-react';
import { Author } from '@/types';

interface AuthorCardProps {
  author: Author;
  variant?: 'compact' | 'full';
  showBio?: boolean;
  showSocial?: boolean;
}

export default function AuthorCard({
  author,
  variant = 'compact',
  showBio = true,
  showSocial = true,
}: AuthorCardProps) {
  const roleColors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-700',
    editor: 'bg-blue-100 text-blue-700',
    author: 'bg-green-100 text-green-700',
    contributor: 'bg-gray-100 text-gray-700',
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3">
        <img
          src={author.avatar}
          alt={author.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-gray-900">{author.name}</p>
          <p className="text-sm text-gray-500 capitalize">{author.role}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start gap-4">
        <img
          src={author.avatar}
          alt={author.name}
          className="w-16 h-16 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-gray-900">{author.name}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleColors[author.role]}`}>
              {author.role}
            </span>
          </div>
          
          {showBio && author.bio && (
            <p className="text-gray-600 text-sm mt-2 line-clamp-3">{author.bio}</p>
          )}

          {showSocial && (
            <div className="flex items-center gap-3 mt-4">
              {author.social_links?.linkedin && (
                <a
                  href={author.social_links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {author.social_links?.twitter && (
                <a
                  href={author.social_links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  aria-label="Twitter Profile"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {author.social_links?.website && (
                <a
                  href={author.social_links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Personal Website"
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
              <a
                href={`mailto:${author.email}`}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Email Author"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Author list component for team page
export function AuthorList({ authors }: { authors: Author[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {authors.map((author) => (
        <AuthorCard key={author.id} author={author} variant="full" />
      ))}
    </div>
  );
}

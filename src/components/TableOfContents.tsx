import React, { useState, useEffect } from 'react';
import { List, ChevronRight } from 'lucide-react';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
  className?: string;
}

export default function TableOfContents({ items, className = '' }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (items.length === 0) return null;

  return (
    <nav className={`${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <List className="w-5 h-5 text-gray-500" />
        <h3 className="font-bold text-gray-900">Table of Contents</h3>
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => scrollToSection(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 ${
                activeId === item.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } ${item.level === 3 ? 'pl-6' : ''}`}
            >
              {activeId === item.id && (
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              )}
              <span className={activeId === item.id ? '' : 'ml-6'}>{item.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Utility function to extract headings from article content
export function extractHeadingsFromContent(content: string): TOCItem[] {
  const headingRegex = /<h([2-4])[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h[2-4]>/gi;
  const items: TOCItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    items.push({
      id: match[2],
      title: match[3],
      level: parseInt(match[1], 10),
    });
  }

  return items;
}

// Auto-generate TOC from DOM
export function generateTOCFromDOM(containerSelector: string): TOCItem[] {
  const container = document.querySelector(containerSelector);
  if (!container) return [];

  const headings = container.querySelectorAll('h2, h3, h4');
  const items: TOCItem[] = [];

  headings.forEach((heading, index) => {
    const id = heading.id || `heading-${index}`;
    if (!heading.id) {
      heading.id = id;
    }

    items.push({
      id,
      title: heading.textContent || '',
      level: parseInt(heading.tagName.charAt(1), 10),
    });
  });

  return items;
}

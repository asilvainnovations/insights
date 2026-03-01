import React from 'react';
import { Article, Author } from '@/types';

interface SEOHeadProps {
  article?: Article;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

// This component generates SEO meta tags and structured data
// In a real implementation, you'd use react-helmet or Next.js Head
export function generateSEOData({
  article,
  title = 'ASilva Innovations Blog | Systems Thinking & Strategic Leadership',
  description = 'Expert insights on systems thinking, integrated risk management, AI analytics, and real-time leadership from ASilva Innovations.',
  image = 'https://asilvainnovations.com/assets/apps/user_1097/app_13212/draft/icon/app_logo.png',
  url = 'https://blog.asilvainnovations.com',
  type = 'website',
}: SEOHeadProps) {
  const seoData = {
    title: article ? `${article.title} | ASilva Innovations` : title,
    description: article?.meta_description || article?.excerpt || description,
    image: article?.og_image || article?.featured_image || image,
    url: article ? `${url}/article/${article.slug}` : url,
    type: article ? 'article' : type,
  };

  // Generate JSON-LD structured data
  const structuredData = article
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.excerpt,
        image: article.featured_image,
        datePublished: article.published_at,
        dateModified: article.updated_at,
        author: article.author
          ? {
              '@type': 'Person',
              name: article.author.name,
              url: article.author.social_links?.linkedin,
            }
          : undefined,
        publisher: {
          '@type': 'Organization',
          name: 'ASilva Innovations',
          logo: {
            '@type': 'ImageObject',
            url: 'https://asilvainnovations.com/assets/apps/user_1097/app_13212/draft/icon/app_logo.png',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${url}/article/${article.slug}`,
        },
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'ASilva Innovations',
        url: 'https://asilvainnovations.com',
        logo: 'https://asilvainnovations.com/assets/apps/user_1097/app_13212/draft/icon/app_logo.png',
        description: 'Leading consultancy specializing in systems thinking, integrated risk management, and strategic leadership development.',
        sameAs: [
          'https://linkedin.com/company/asilvainnovations',
          'https://twitter.com/asilvainnovations',
        ],
      };

  return { seoData, structuredData };
}

// Breadcrumb structured data generator
export function generateBreadcrumbData(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// FAQ structured data generator
export function generateFAQData(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Component to render structured data script
export default function SEOHead({ article, title, description, image, url, type }: SEOHeadProps) {
  const { seoData, structuredData } = generateSEOData({ article, title, description, image, url, type });

  // In a real app, you'd inject these into the document head
  // For now, we'll just render the structured data as a script tag
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Sitemap generator utility
export function generateSitemapXML(articles: Article[], baseUrl = 'https://blog.asilvainnovations.com') {
  const staticPages = [
    { url: baseUrl, priority: '1.0', changefreq: 'daily' },
    { url: `${baseUrl}/about`, priority: '0.8', changefreq: 'monthly' },
    { url: `${baseUrl}/contact`, priority: '0.8', changefreq: 'monthly' },
  ];

  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/article/${article.slug}`,
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: article.updated_at,
  }));

  const allPages = [...staticPages, ...articlePages];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;
}

// Canonical URL generator
export function getCanonicalUrl(article?: Article, baseUrl = 'https://blog.asilvainnovations.com') {
  if (article?.canonical_url) {
    return article.canonical_url;
  }
  if (article) {
    return `${baseUrl}/article/${article.slug}`;
  }
  return baseUrl;
}

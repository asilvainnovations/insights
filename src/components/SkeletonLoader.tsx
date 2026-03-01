import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'shimmer' | 'none';
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    shimmer: 'skeleton',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
}

// Pre-built skeleton components
export function ArticleCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
      <Skeleton className="h-48 w-full" variant="rectangular" />
      <div className="p-5">
        <div className="flex gap-3 mb-3">
          <Skeleton className="h-4 w-16" variant="text" />
          <Skeleton className="h-4 w-16" variant="text" />
        </div>
        <Skeleton className="h-6 w-full mb-2" variant="text" />
        <Skeleton className="h-6 w-3/4 mb-4" variant="text" />
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <Skeleton className="w-8 h-8" variant="circular" />
          <Skeleton className="h-4 w-24" variant="text" />
        </div>
      </div>
    </div>
  );
}

export function FeaturedArticleSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
      <div className="grid md:grid-cols-5 gap-0">
        <Skeleton className="md:col-span-3 h-64 md:h-96" variant="rectangular" />
        <div className="md:col-span-2 p-8">
          <Skeleton className="h-4 w-32 mb-4" variant="text" />
          <Skeleton className="h-8 w-full mb-2" variant="text" />
          <Skeleton className="h-8 w-3/4 mb-4" variant="text" />
          <Skeleton className="h-20 w-full mb-6" variant="rectangular" />
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12" variant="circular" />
            <div>
              <Skeleton className="h-4 w-24 mb-2" variant="text" />
              <Skeleton className="h-3 w-20" variant="text" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArticleDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Skeleton */}
      <Skeleton className="h-[60vh] min-h-[500px] w-full" variant="rectangular" />
      
      {/* Content Skeleton */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Skeleton className="h-6 w-3/4 mb-4" variant="text" />
        <Skeleton className="h-4 w-full mb-2" variant="text" />
        <Skeleton className="h-4 w-full mb-2" variant="text" />
        <Skeleton className="h-4 w-2/3 mb-8" variant="text" />
        
        <Skeleton className="h-8 w-1/2 mb-4" variant="text" />
        <Skeleton className="h-4 w-full mb-2" variant="text" />
        <Skeleton className="h-4 w-full mb-2" variant="text" />
        <Skeleton className="h-4 w-full mb-2" variant="text" />
        <Skeleton className="h-4 w-3/4 mb-8" variant="text" />
        
        <Skeleton className="h-64 w-full mb-8" variant="rectangular" />
        
        <Skeleton className="h-4 w-full mb-2" variant="text" />
        <Skeleton className="h-4 w-full mb-2" variant="text" />
        <Skeleton className="h-4 w-1/2" variant="text" />
      </div>
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className="flex gap-4">
      <Skeleton className="w-12 h-12 flex-shrink-0" variant="circular" />
      <div className="flex-1">
        <Skeleton className="h-4 w-32 mb-2" variant="text" />
        <Skeleton className="h-3 w-24 mb-4" variant="text" />
        <Skeleton className="h-16 w-full" variant="rectangular" />
      </div>
    </div>
  );
}

export function AnalyticsCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-2" variant="text" />
          <Skeleton className="h-8 w-32 mb-2" variant="text" />
          <Skeleton className="h-4 w-28" variant="text" />
        </div>
        <Skeleton className="w-12 h-12" variant="rectangular" />
      </div>
    </div>
  );
}

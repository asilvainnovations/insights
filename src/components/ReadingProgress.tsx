import React, { useState, useEffect } from 'react';

interface ReadingProgressProps {
  targetRef?: React.RefObject<HTMLElement>;
}

export default function ReadingProgress({ targetRef }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      let scrollTop: number;
      let scrollHeight: number;

      if (targetRef?.current) {
        const element = targetRef.current;
        const rect = element.getBoundingClientRect();
        const elementTop = window.scrollY + rect.top;
        const elementHeight = element.scrollHeight;
        
        scrollTop = Math.max(0, window.scrollY - elementTop);
        scrollHeight = elementHeight - window.innerHeight;
      } else {
        scrollTop = window.scrollY;
        scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      }

      if (scrollHeight > 0) {
        const percentage = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setProgress(percentage);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [targetRef]);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
      <div
        className="h-full bg-gradient-to-r from-blue-600 to-teal-500 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

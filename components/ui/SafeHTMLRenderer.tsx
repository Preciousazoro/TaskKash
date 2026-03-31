"use client";

import React, { useMemo, useCallback } from 'react';
import DOMPurify from 'dompurify';

interface SafeHTMLRendererProps {
  content: string;
  className?: string;
  fallback?: 'plain-text' | 'html-stripped';
}

// DOMPurify configuration
const DOMPURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 
    'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'a', 'span'
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
  FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur'],
  SANITIZE_DOM: true,
  SAFE_FOR_TEMPLATES: true,
  WHOLE_DOCUMENT: false,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false
};

// Performance monitoring for debugging
let renderCount = 0;
let totalSanitizeTime = 0;

export function SafeHTMLRenderer({ 
  content, 
  className = "", 
  fallback = 'plain-text' 
}: SafeHTMLRendererProps) {
  
  // Fast HTML detection - avoid expensive regex on large content
  const hasHTML = useMemo(() => {
    // Quick check for common HTML patterns
    const quickCheck = content.includes('<') && content.includes('>');
    if (!quickCheck) return false;
    
    // More precise check only if needed
    return /<[a-z][\s\S]*>/i.test(content);
  }, [content]);

  // Sanitize HTML with DOMPurify - memoized for performance
  const sanitizedContent = useMemo(() => {
    if (!hasHTML) {
      return content; // Return plain text as-is
    }

    const startTime = performance.now();
    
    try {
      // Sanitize HTML with DOMPurify using configuration
      let clean = DOMPurify.sanitize(content, {
        ...DOMPURIFY_CONFIG,
        ADD_ATTR: ['target', 'rel']
      });
      
      // Ensure external links open safely
      clean = clean.replace(/<a\s+href=(["'])(http[^"']+)\1[^>]*>/gi, (match, quote, url) => {
        return match.replace(/>/, ' target="_blank" rel="noopener noreferrer">');
      });
      
      const endTime = performance.now();
      totalSanitizeTime += (endTime - startTime);
      renderCount++;
      
      // Log performance metrics in development
      if (process.env.NODE_ENV === 'development' && renderCount % 10 === 0) {
        console.log(`SafeHTMLRenderer: ${renderCount} renders, avg sanitize time: ${(totalSanitizeTime / renderCount).toFixed(2)}ms`);
      }
      
      return clean;
    } catch (error) {
      console.error('DOMPurify sanitization failed:', error);
      return null; // Signal fallback needed
    }
  }, [content, hasHTML]);

  // Fallback rendering for errors
  const renderFallback = useCallback((fallbackContent: string, useStripped: boolean = false) => {
    const finalContent = useStripped 
      ? fallbackContent.replace(/<[^>]*>/g, '')
      : fallbackContent;
    
    return (
      <div className={`whitespace-pre-line leading-relaxed ${className}`}>
        {finalContent}
      </div>
    );
  }, [className]);

  // Render plain text directly (most common case)
  if (!hasHTML) {
    return renderFallback(content, false);
  }

  // Render sanitized HTML
  if (sanitizedContent !== null) {
    return (
      <div 
        className={`prose prose-sm dark:prose-invert max-w-none leading-relaxed ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    );
  }

  // Fallback for sanitization errors
  return renderFallback(content, fallback === 'html-stripped');
}

// Export performance stats for debugging
export const getSafeHTMLRendererStats = () => ({
  renderCount,
  totalSanitizeTime,
  averageTime: renderCount > 0 ? totalSanitizeTime / renderCount : 0
});

// Reset stats (useful for testing)
export const resetSafeHTMLRendererStats = () => {
  renderCount = 0;
  totalSanitizeTime = 0;
};

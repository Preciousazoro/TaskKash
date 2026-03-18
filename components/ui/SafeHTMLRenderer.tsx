"use client";

import React from 'react';

interface SafeHTMLRendererProps {
  content: string;
  className?: string;
  fallback?: 'plain-text' | 'html-stripped';
}

export function SafeHTMLRenderer({ 
  content, 
  className = "", 
  fallback = 'plain-text' 
}: SafeHTMLRendererProps) {
  // Check if content contains HTML tags
  const hasHTML = /<[a-z][\s\S]*>/i.test(content);

  if (!hasHTML) {
    // Plain text content - render with line breaks preserved
    return (
      <div className={`whitespace-pre-line leading-relaxed ${className}`}>
        {content}
      </div>
    );
  }

  // HTML content - sanitize and render safely
  const sanitizeHTML = (html: string) => {
    // Allowed tags for rich text content
    const allowedTags = [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 
      'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'a', 'span'
    ];
    
    // Allowed attributes
    const allowedAttributes: Record<string, string[]> = {
      'a': ['href', 'target', 'rel'],
      'span': ['style'],
      '*': ['class']
    };

    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Recursive function to sanitize nodes
    const sanitizeNode = (node: Node): void => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();

        // Check if tag is allowed
        if (!allowedTags.includes(tagName)) {
          // Replace disallowed element with its text content
          while (element.firstChild) {
            element.parentNode?.insertBefore(element.firstChild, element);
          }
          element.parentNode?.removeChild(element);
          return;
        }

        // Remove disallowed attributes
        const attributes = Array.from(element.attributes);
        attributes.forEach(attr => {
          const attrName = attr.name.toLowerCase();
          const allowedAttrs = allowedAttributes[tagName] || allowedAttributes['*'] || [];
          
          if (!allowedAttrs.includes(attrName)) {
            element.removeAttribute(attr.name);
          }
        });

        // Sanitize links
        if (tagName === 'a') {
          const href = element.getAttribute('href');
          if (href && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('#')) {
            element.removeAttribute('href');
          } else if (href && href.startsWith('http')) {
            element.setAttribute('target', '_blank');
            element.setAttribute('rel', 'noopener noreferrer');
          }
        }
      }

      // Recursively sanitize child nodes
      const childNodes = Array.from(node.childNodes);
      childNodes.forEach(child => {
        if (child.parentNode === node) {
          sanitizeNode(child);
        }
      });
    };

    // Start sanitization
    sanitizeNode(tempDiv);

    // Return sanitized HTML
    return tempDiv.innerHTML;
  };

  try {
    const sanitizedContent = sanitizeHTML(content);
    
    return (
      <div 
        className={`prose prose-sm dark:prose-invert max-w-none leading-relaxed ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    );
  } catch (error) {
    console.error('Error rendering HTML content:', error);
    
    // Fallback rendering
    if (fallback === 'html-stripped') {
      const strippedContent = content.replace(/<[^>]*>/g, '');
      return (
        <div className={`whitespace-pre-line leading-relaxed ${className}`}>
          {strippedContent}
        </div>
      );
    }
    
    // Default plain text fallback
    return (
      <div className={`whitespace-pre-line leading-relaxed ${className}`}>
        {content}
      </div>
    );
  }
}

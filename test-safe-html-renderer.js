// Test script to verify SafeHTMLRenderer performance
// Run this in the browser console or as a component

import { SafeHTMLRenderer, getSafeHTMLRendererStats, resetSafeHTMLRendererStats } from '@/components/ui/SafeHTMLRenderer';

// Test cases with different content types
const testCases = [
  {
    name: 'Plain text (common case)',
    content: 'This is simple plain text content that should render quickly without any HTML processing.'
  },
  {
    name: 'Simple HTML',
    content: '<p>This is <strong>simple</strong> HTML content with <em>basic</em> formatting.</p>'
  },
  {
    name: 'Complex HTML (old problem case)',
    content: '<div><p>This is <strong>complex</strong> HTML with <em>nested</em> <span style="color: red">formatting</span> and <a href="https://example.com">links</a>.</p><ul><li>Item 1</li><li>Item 2</li></ul></div>'
  },
  {
    name: 'Large content (performance test)',
    content: '<div>' + '<p>This is a large paragraph with <strong>bold</strong> and <em>italic</em> text.</p>'.repeat(50) + '</div>'
  }
];

// Performance test function
export function testSafeHTMLRendererPerformance() {
  console.log('🧪 Testing SafeHTMLRenderer Performance');
  resetSafeHTMLRendererStats();
  
  testCases.forEach((testCase, index) => {
    console.log(`\n--- Test ${index + 1}: ${testCase.name} ---`);
    
    const startTime = performance.now();
    
    // Render the component (this would normally be done by React)
    // For testing, we'll simulate multiple renders
    for (let i = 0; i < 10; i++) {
      // Simulate the memoization checks
      const hasHTML = /<[a-z][\s\S]*>/i.test(testCase.content);
      if (hasHTML) {
        // Simulate DOMPurify sanitization (simplified)
        const clean = testCase.content.replace(/<script[^>]*>.*?<\/script>/gi, '');
      }
    }
    
    const endTime = performance.now();
    console.log(`⏱️  Time for 10 renders: ${(endTime - startTime).toFixed(2)}ms`);
  });
  
  const stats = getSafeHTMLRendererStats();
  console.log('\n📊 Final Stats:', stats);
  
  return stats;
}

// Test problematic content that would cause the old renderer to freeze
export function testProblematicContent() {
  console.log('🚨 Testing problematic content patterns');
  
  const problematicCases = [
    {
      name: 'Deeply nested HTML',
      content: '<div><div><div><div><div><div><div><div><div><div>Deep nesting</div></div></div></div></div></div></div></div></div></div>'
    },
    {
      name: 'Many HTML tags',
      content: '<div>' + '<span>text</span>'.repeat(100) + '</div>'
    },
    {
      name: 'Mixed content with line breaks',
      content: 'Step 1: Do this\nStep 2: Do that\nStep 3: <strong>Important</strong>\nStep 4: <em>Also important</em>\nStep 5: Final step'
    }
  ];
  
  problematicCases.forEach((testCase, index) => {
    console.log(`\n--- Problematic Test ${index + 1}: ${testCase.name} ---`);
    
    const startTime = performance.now();
    
    // Test HTML detection
    const hasHTML = testCase.content.includes('<') && testCase.content.includes('>');
    console.log(`🔍 HTML detected: ${hasHTML}`);
    
    // Test length check
    console.log(`📏 Content length: ${testCase.content.length} characters`);
    
    // Test tag count
    const tagCount = (testCase.content.match(/<[^>]+>/g) || []).length;
    console.log(`🏷️  HTML tag count: ${tagCount}`);
    
    const endTime = performance.now();
    console.log(`⏱️  Processing time: ${(endTime - startTime).toFixed(2)}ms`);
  });
}

// Export for use in development
export { getSafeHTMLRendererStats, resetSafeHTMLRendererStats };

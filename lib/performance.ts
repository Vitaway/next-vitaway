/**
 * Performance Monitoring Utilities
 * Helpers for tracking and reporting performance metrics
 */

// TypeScript extensions for Navigator API
interface NavigatorConnection {
  saveData?: boolean;
  effectiveType?: string;
}

interface ExtendedNavigator extends Navigator {
  deviceMemory?: number;
  connection?: NavigatorConnection;
}

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: { 
  id: string; 
  name: string; 
  value: number;
  label: 'web-vital' | 'custom';
}) {
  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics
    // window.gtag?.('event', metric.name, {
    //   value: Math.round(metric.value),
    //   event_category: 'Web Vitals',
    //   non_interaction: true,
    // });

    // Or send to custom analytics endpoint
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   body: JSON.stringify(metric),
    //   headers: { 'Content-Type': 'application/json' },
    // });
  }
}

/**
 * Measure component render time
 */
export function measureRenderTime(componentName: string) {
  if (typeof window === 'undefined') return;

  const startMark = `${componentName}-render-start`;
  const endMark = `${componentName}-render-end`;
  const measureName = `${componentName}-render`;

  performance.mark(startMark);

  return () => {
    performance.mark(endMark);
    performance.measure(measureName, startMark, endMark);
    
    const measure = performance.getEntriesByName(measureName)[0];

    // Clean up
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    performance.clearMeasures(measureName);
  };
}

/**
 * Track API call performance
 */
export async function measureApiCall<T>(
  apiName: string,
  apiCall: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  
  try {
    const result = await apiCall();
    const duration = performance.now() - start;
    
    // Track slow API calls
    if (duration > 3000) {
      console.warn(`[Slow API] ${apiName} took ${Math.round(duration)}ms`);
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`[API Error] ${apiName} failed after ${Math.round(duration)}ms:`, error);
    throw error;
  }
}

/**
 * Detect slow renders in development
 */
export function useRenderPerformance(componentName: string, threshold = 16) {
  if (process.env.NODE_ENV !== 'development') return;

  const startTime = performance.now();

  // This runs after render
  if (typeof window !== 'undefined') {
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    if (renderTime > threshold) {
      console.warn(
        `⚠️ Slow render detected in ${componentName}: ${Math.round(renderTime)}ms (threshold: ${threshold}ms)`
      );
    }
  }
}

/**
 * Log bundle sizes (use in production build analysis)
 */
export function logBundleSize() {
  if (typeof window === 'undefined') return;

  // Get all script tags
  const scripts = document.querySelectorAll('script[src]');

  scripts.forEach((script) => {
    const src = script.getAttribute('src');
    if (src && src.includes('/_next/')) {
      // This would need actual size fetching in real implementation
    }
  });
}

/**
 * Check if device is low-end
 */
export function isLowEndDevice(): boolean {
  if (typeof navigator === 'undefined') return false;

  const nav = navigator as ExtendedNavigator;
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Check for save data mode
  const saveData = 'connection' in navigator && nav.connection?.saveData;
  
  // Check for low memory
  const lowMemory = 'deviceMemory' in navigator && (nav.deviceMemory ?? 4) < 4;
  
  // Check for slow connection
  const slowConnection = 'connection' in navigator && 
    ['slow-2g', '2g'].includes(nav.connection?.effectiveType ?? '');

  return prefersReducedMotion || saveData || lowMemory || slowConnection;
}

/**
 * Get device performance tier
 */
export function getPerformanceTier(): 'high' | 'medium' | 'low' {
  if (typeof window === 'undefined') return 'medium';

  const nav = navigator as ExtendedNavigator;
  const memory = nav.deviceMemory ?? 4;
  const cores = navigator.hardwareConcurrency || 2;

  if (memory >= 8 && cores >= 8) return 'high';
  if (memory >= 4 && cores >= 4) return 'medium';
  return 'low';
}

/**
 * Adaptive loading based on device capabilities
 */
export function shouldLoadFeature(featureName: string): boolean {
  const tier = getPerformanceTier();
  const isLowEnd = isLowEndDevice();

  // Define features that should be disabled on low-end devices
  const heavyFeatures = ['animations', 'video-autoplay', 'parallax-effects'];
  const mediumFeatures = ['lazy-images', 'prefetch'];

  // Disable heavy features on low-end devices
  if (isLowEnd && heavyFeatures.includes(featureName)) {
    return false;
  }

  // Disable medium features on low tier devices
  if (tier === 'low' && mediumFeatures.includes(featureName)) {
    return false;
  }

  return true;
}

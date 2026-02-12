# Website Optimization Guide

This document outlines the optimization strategies implemented in the Vitaway Next.js application.

## 🚀 Performance Optimizations

### 1. **Loading States & Spinners**

#### Available Spinner Components

Located in [`app/components/spinners/`](../app/components/spinners/):

- **`Spinner`** - Base spinner component with size and color variants
- **`ButtonSpinner`** - Spinner for button loading states
- **`FullPageSpinner`** - Full page overlay with loading indicator
- **`InlineSpinner`** - Inline spinner with message
- **`CardSkeleton`** - Generic skeleton loader for cards
- **`LoadingOverlay`** - Wrapper component for loading overlays

#### Usage Examples

```tsx
import { Spinner, ButtonSpinner, InlineSpinner } from '@/app/components/spinners';

// Button with loading state
<button disabled={isLoading}>
  {isLoading ? <ButtonSpinner loadingText="Saving" /> : 'Save'}
</button>

// Inline loading
{isLoading && <InlineSpinner message="Loading data" />}

// Custom spinner
<Spinner size="lg" color="primary" />
```

### 2. **React.memo Optimization**

Components optimized with `React.memo` to prevent unnecessary re-renders:

- ✅ `BlogCard` - Memoized blog card component
- ✅ `ProductCard` - Memoized product card component
- ✅ `BlogList` - Memoized blog list container
- ✅ `Blogs` - Memoized blogs section
- ✅ `AllBlogs` - Memoized all blogs section
- ✅ `ProductsList` - Memoized products list

**When to use React.memo:**
- Components that receive the same props frequently
- Components rendering large lists
- Components with expensive render logic
- Child components that don't need to re-render when parent updates

### 3. **Image Optimization**

#### Next.js Image Component

All images use the Next.js `<Image>` component for automatic optimization:

```tsx
import Image from 'next/image';

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={500}
  height={500}
  loading="lazy"      // Lazy load images
  quality={85}        // Optimize quality (default: 75)
  priority={false}    // Set true for above-fold images
/>
```

#### OptimizedImage Component

For advanced use cases with loading states and error handling:

```tsx
import { OptimizedImage } from '@/app/components/OptimizedImage';

<OptimizedImage
  src="/image.jpg"
  alt="Product"
  width={500}
  height={500}
  fallbackSrc="/placeholder.png"
  showLoader={true}
/>
```

#### Image Configuration

External domains configured in [`next.config.ts`](../next.config.ts):

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'www.goodlifeaccess.org',
    },
    // Add more domains as needed
  ],
}
```

### 4. **API & Data Fetching Optimization**

#### Centralized API Client

All API calls use the centralized client in [`lib/api/`](../lib/api/):

- ✅ Single Axios instance with interceptors
- ✅ Automatic error handling
- ✅ Request/response transformation
- ✅ Timeout configuration (30s)

#### Custom Hooks with Built-in Loading States

```tsx
import { useBlogs, useProducts } from '@/hooks';

function MyComponent() {
  const { blogs, loading, error, refetch } = useBlogs({ limit: 10 });
  
  if (loading) return <InlineSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return <BlogList blogs={blogs} />;
}
```

#### Server-Side Data Fetching

For static pages, use Next.js static generation:

```tsx
// app/blogs/[slug]/page.tsx
export async function generateStaticParams() {
  const blogs = await blogService.getAll();
  return blogs.map(blog => ({ slug: blog.slug }));
}
```

### 5. **Code Splitting & Lazy Loading**

#### Dynamic Imports

For large components not needed immediately:

```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <InlineSpinner message="Loading component" />,
  ssr: false, // Disable server-side rendering if not needed
});
```

#### Route-based Code Splitting

Next.js automatically splits code by route. Each page in `app/` directory is a separate chunk.

### 6. **Global Loading State**

Use the `LoadingProvider` for application-wide loading states:

```tsx
// app/layout.tsx
import { LoadingProvider } from '@/context/LoadingContext';

export default function RootLayout({ children }) {
  return (
    <LoadingProvider>
      {children}
    </LoadingProvider>
  );
}

// In any component
import { useGlobalLoading } from '@/context/LoadingContext';

function MyComponent() {
  const { setLoading } = useGlobalLoading();
  
  const handleAction = async () => {
    setLoading(true, 'Processing...');
    await someAsyncOperation();
    setLoading(false);
  };
}
```

## 📊 Performance Monitoring

### Metrics to Track

1. **First Contentful Paint (FCP)** - < 1.8s (good)
2. **Largest Contentful Paint (LCP)** - < 2.5s (good)
3. **Time to Interactive (TTI)** - < 3.8s (good)
4. **Cumulative Layout Shift (CLS)** - < 0.1 (good)

### Lighthouse Score Goals

- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 95
- **SEO**: > 95

### Tools for Monitoring

```bash
# Run Lighthouse locally
npx lighthouse http://localhost:3000

# Analyze bundle size
npm run build
npx @next/bundle-analyzer
```

## 🔧 Build Optimization

### Production Build

```bash
# Build for production
npm run build

# Analyze the build
npm run build && npm run analyze
```

### Environment Variables

Ensure all required environment variables are set in `.env`:

```env
NEXT_PUBLIC_ENVENTORY_API_URL=https://api.vitaway.org
```

## 🎯 Best Practices Checklist

### Component Level
- [ ] Use `React.memo` for components with stable props
- [ ] Implement proper key props in lists
- [ ] Use loading states for async operations
- [ ] Handle error states gracefully
- [ ] Use skeleton loaders for better UX

### Data Fetching
- [ ] Use custom hooks for data fetching
- [ ] Implement proper caching strategies
- [ ] Show loading indicators during fetches
- [ ] Handle errors with user-friendly messages
- [ ] Use optimistic updates when appropriate

### Images
- [ ] Use Next.js `<Image>` component
- [ ] Set proper width and height
- [ ] Use `priority` for above-fold images
- [ ] Implement lazy loading for below-fold images
- [ ] Configure external image domains

### SEO
- [ ] Add proper meta tags
- [ ] Use semantic HTML
- [ ] Implement structured data
- [ ] Add alt text to images
- [ ] Create sitemap and robots.txt

## 📝 Future Enhancements

1. **Add Request Caching**
   - Implement React Query or SWR for data caching
   - Add stale-while-revalidate strategy

2. **Service Worker**
   - Add offline support
   - Cache static assets
   - Implement background sync

3. **Analytics**
   - Add Google Analytics or similar
   - Track user interactions
   - Monitor performance metrics

4. **CDN Integration**
   - Use Cloudflare or similar CDN
   - Optimize asset delivery
   - Enable edge caching

5. **Database Query Optimization**
   - Add database indexes
   - Implement pagination
   - Use database connection pooling

## 🐛 Debugging Performance Issues

### Common Issues

1. **Slow API Responses**
   - Check network tab in DevTools
   - Verify API endpoint performance
   - Implement loading states

2. **Large Bundle Size**
   - Analyze with webpack-bundle-analyzer
   - Remove unused dependencies
   - Implement code splitting

3. **Memory Leaks**
   - Clean up subscriptions in useEffect
   - Remove event listeners
   - Clear timers and intervals

### Tools

- Chrome DevTools Performance tab
- React DevTools Profiler
- Lighthouse CI
- Next.js Built-in Bundle Analyzer

## 📚 Additional Resources

- [Next.js Performance Optimization](https://nextjs.org/docs/app/building-your-application/optimizing)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/overview/)

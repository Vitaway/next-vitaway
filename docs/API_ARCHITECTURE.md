# API Architecture Documentation

## Overview

This documentation describes the centralized API architecture implemented for the Vitaway Next.js application. The architecture follows best practices for separation of concerns, reusability, and maintainability.

## Directory Structure

```
lib/api/
├── client.ts           # Axios client with interceptors
├── types.ts            # TypeScript type definitions
├── services/
│   ├── index.ts        # Service exports
│   ├── blogs.ts        # Blog API service
│   ├── products.ts     # Product API service
│   ├── appointments.ts # Appointment API service
│   └── contact.ts      # Contact form API service
└── index.ts            # Main API export

hooks/
├── index.ts            # Hook exports
├── useBlogs.ts         # Blog data fetching hook
├── useBlog.ts          # Single blog fetching hook
├── useProducts.ts      # Products data fetching hook
├── useProduct.ts       # Single product fetching hook
├── useCategories.ts    # Categories fetching hook
├── useAppointment.ts   # Appointment submission hook
└── useContact.ts       # Contact form submission hook
```

## Core Components

### 1. API Client (`lib/api/client.ts`)

The centralized Axios client provides:
- Base URL configuration from environment variables
- Request/response interceptors
- Unified error handling with custom `APIError` class
- Generic HTTP methods (GET, POST, PUT, PATCH, DELETE)

**Usage:**
```typescript
import { get, post } from '@/lib/api/client';

// GET request
const data = await get<BlogsResponse>('/api/blogs');

// POST request
const result = await post<ContactResponse>('/api/contact', payload);
```

### 2. API Services (`lib/api/services/`)

Service modules encapsulate all API calls for specific domains:

#### Blog Service
```typescript
import { blogService } from '@/lib/api';

// Fetch all blogs
const blogs = await blogService.getAll();

// Fetch blog by slug
const blog = await blogService.getBySlug('my-blog-slug');

// Fetch by category
const categoryBlogs = await blogService.getByCategory('nutrition');

// Search blogs
const results = await blogService.search('wellness');
```

#### Product Service
```typescript
import { productService } from '@/lib/api';

// Fetch all products
const products = await productService.getAll();

// Fetch with category filter
const filtered = await productService.getAll({ category: 'supplements' });

// Fetch product by slug
const { product, related_products } = await productService.getBySlug('product-slug');

// Fetch categories
const categories = await productService.getCategories();
```

#### Appointment Service
```typescript
import { appointmentService } from '@/lib/api';

// Create appointment
const result = await appointmentService.create(appointmentPayload);

// Validate before submission
const errors = appointmentService.validate(appointmentPayload);
```

#### Contact Service
```typescript
import { contactService } from '@/lib/api';

// Submit contact form
const result = await contactService.submit(contactPayload);

// Validate before submission
const errors = contactService.validate(contactPayload);
```

### 3. Custom Hooks (`hooks/`)

React hooks provide a declarative way to work with API data:

#### useBlogs Hook
```typescript
import { useBlogs } from '@/hooks';

function BlogsComponent() {
  const { blogs, loading, error, refetch } = useBlogs({ 
    limit: 4,           // Optional: limit results
    category: 'health', // Optional: filter by category
    autoFetch: true     // Optional: auto-fetch on mount (default: true)
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  
  return <BlogList blogs={blogs} />;
}
```

#### useProducts Hook
```typescript
import { useProducts } from '@/hooks';

function ProductsComponent() {
  const { products, loading, error, refetch } = useProducts({ 
    category: 'supplements', // Optional: filter by category
    autoFetch: true          // Optional: auto-fetch on mount
  });

  return (
    <>
      {loading && <Loading />}
      {error && <Error message={error} />}
      {!loading && <ProductList products={products} />}
    </>
  );
}
```

#### useCategories Hook
```typescript
import { useCategories } from '@/hooks';

function CategoryFilter() {
  const { categories, loading, error } = useCategories();

  return (
    <select>
      {categories.map(cat => (
        <option key={cat.id} value={cat.id}>{cat.name}</option>
      ))}
    </select>
  );
}
```

#### useAppointment Hook
```typescript
import { useAppointment } from '@/hooks';

function AppointmentForm() {
  const { submitting, success, error, createAppointment, reset } = useAppointment();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSuccess = await createAppointment(formData);
    
    if (isSuccess) {
      // Clear form
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
      {error && <Error message={error} />}
      {success && <Success message={success} />}
    </form>
  );
}
```

#### useContact Hook
```typescript
import { useContact } from '@/hooks';

function ContactForm() {
  const { submitting, success, error, submitContact, reset } = useContact();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSuccess = await submitContact({ fullname, email, message });
    
    if (isSuccess) {
      // Clear form
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={submitting}>Send</button>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </form>
  );
}
```

## Type Definitions

### API Response Types

All API responses follow a consistent structure:

```typescript
interface APIResponse<T> {
  data: T;
  message?: string;
  status?: string;
}
```

### Request State Type

Custom hooks return a consistent state structure:

```typescript
interface RequestState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
```

## Error Handling

### API Error Class

```typescript
class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public data?: unknown
  )
}
```

### Error Handling in Components

```typescript
try {
  await blogService.getAll();
} catch (err) {
  if (err instanceof APIError) {
    console.error('API Error:', err.message, err.statusCode);
  }
}
```

## Best Practices

### 1. Always Use Hooks in Components

❌ **Don't:**
```typescript
// Don't call services directly in components
const [blogs, setBlogs] = useState([]);
useEffect(() => {
  blogService.getAll().then(setBlogs);
}, []);
```

✅ **Do:**
```typescript
// Use the custom hook
const { blogs, loading, error } = useBlogs();
```

### 2. Use Service Layer for Server Components

For Next.js Server Components and API routes, use services directly:

```typescript
// app/blogs/[slug]/page.tsx
import { blogService } from '@/lib/api';

export async function generateMetadata({ params }) {
  const blog = await blogService.getBySlug(params.slug);
  return { title: blog.title };
}
```

### 3. Validate Before Submitting

```typescript
// Use built-in validation
const errors = appointmentService.validate(formData);
if (errors.length > 0) {
  console.error('Validation errors:', errors);
  return;
}
```

### 4. Handle Loading and Error States

```typescript
const { data, loading, error } = useProducts();

if (loading) return <Skeleton />;
if (error) return <ErrorMessage message={error} />;
return <ProductList products={data} />;
```

## Environment Variables

Ensure the following environment variables are set:

```env
NEXT_PUBLIC_ENVENTORY_API_URL=https://api.vitaway.org
```

## Migration Guide

### From Old Pattern to New Pattern

#### Before (Direct Fetch):
```typescript
const [blogs, setBlogs] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_ENVENTORY_API_URL}/api/blogs`)
    .then(res => res.json())
    .then(data => {
      setBlogs(data.data);
      setLoading(false);
    });
}, []);
```

#### After (Using Hook):
```typescript
const { blogs, loading } = useBlogs();
```

## Benefits

1. **DRY (Don't Repeat Yourself)**: Reusable API logic
2. **Type Safety**: Full TypeScript support
3. **Consistent Error Handling**: Unified error responses
4. **Better Testing**: Services and hooks can be easily mocked
5. **Maintainability**: Changes to API endpoints happen in one place
6. **Loading States**: Built-in loading and error state management
7. **Validation**: Centralized validation logic
8. **Performance**: Optimized with React hooks best practices

## Future Enhancements

1. Add request caching with React Query or SWR
2. Implement optimistic updates
3. Add retry logic for failed requests
4. Implement request cancellation for pending requests
5. Add pagination support in hooks
6. Implement WebSocket support for real-time updates
7. Add authentication token management
8. Implement request/response logging in development

## Support

For issues or questions, refer to the main project documentation or contact the development team.

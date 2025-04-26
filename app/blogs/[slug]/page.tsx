/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import GuestLayout from '@/app/layouts/GuestLayout';
import Head from 'next/head';
import { Blogs } from '@/types/blogs';
import ImageSlider from '@/app/components/cards/images-slider';
import '../../styles/blog-content.css';

const BlogPost: React.FC = () => {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const [blog, setBlog] = useState<Blogs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const fetchBlog = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_ENVENTORY_API_URL}/api/blogs/${slug}`);

          if (!res.ok) {
            throw new Error('Blog not found');
          }

          const data = await res.json();
          setBlog(data.data);
          setLoading(false);
        } catch (error) {
          setBlog(null);
          setLoading(false);
        }
      };

      fetchBlog();
    }
  }, [slug]);

  if (loading) {
    return (
      <GuestLayout>
        <div className="min-h-[300px] flex items-center justify-center text-gray-800 text-lg">Loading...</div>
      </GuestLayout>
    );
  }

  if (!blog) {
    return notFound();
  }

  return (
    <GuestLayout>
      <Head>
        <title>{blog.title} | My Blog</title>
        <meta name="description" content={`Read "${blog.title}" by ${blog.author}`} />
      </Head>

      <article className="relative border-t border-gray-200">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded">
          <header>
            <p className="text-indigo-600 text-sm mb-2 font-semibold">{blog.category.name}</p>
            <h1 className="text-gray-900 font-bold text-4xl mb-3 capitalize">{blog.title}</h1>

            <div className="text-sm text-gray-600 flex flex-wrap gap-4 mb-4">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M20.75 13.25c0 4.83-3.92 8.75-8.75 8.75s-8.75-3.92-8.75-8.75S7.17 4.5 12 4.5s8.75 3.92 8.75 8.75Z" />
                  <path d="M12 8v5" opacity=".4" />
                  <path d="M9 2h6" opacity=".4" />
                </svg>
                <time dateTime={blog.created_at || new Date().toISOString()}>
                  {new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                    Math.round((new Date(blog.created_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
                    'day'
                  )}
                </time>
              </span>

              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
                  <path d="M20.59 22c0-3.87-3.85-7-8.59-7s-8.59 3.13-8.59 7" opacity=".4" />
                </svg>
                {blog.author}
              </span>

              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="m4.17 15.3 4.53 4.53a4.78 4.78 0 0 0 6.75 0l4.39-4.39a4.78 4.78 0 0 0 0-6.75L15.3 4.17a4.75 4.75 0 0 0-3.6-1.39l-5 .24c-2 .09-3.59 1.68-3.69 3.67l-.24 5c-.06 1.35.45 2.66 1.4 3.61Z" />
                  <path d="M9.5 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" opacity=".4" />
                </svg>
                {blog.category.name}
              </span>
            </div>

            <hr className="my-4" />
          </header>

          <div className="mb-4">
            <ImageSlider images={blog.images.map((img) => img.image_url)} alt={blog.title} />
          </div>

          <section className="blog-content prose prose-lg max-w-none text-gray-800 blog-content" dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
      </article>
    </GuestLayout>
  );
};

export default BlogPost;

/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import GuestLayout from '@/app/layouts/GuestLayout';
import { Blogs } from '@/types/blogs';
import ImageSlider from '@/app/components/cards/images-slider';
import Script from 'next/script';
import Head from 'next/head';
import "../../styles/blog-content.css";
import Link from 'next/link';

const BlogPost: React.FC = () => {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const [blog, setBlog] = useState<Blogs | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);

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

          // Update document metadata for SEO
          if (data.data) {
            document.title = `${data.data.title} | Vitaway Health Blog`;

            // Update meta description
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
              metaDescription.setAttribute('content', data.data.caption || `Read ${data.data.title} by ${data.data.author} on Vitaway Health`);
            }

            // Update Open Graph tags
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.setAttribute('content', data.data.title);

            const ogDescription = document.querySelector('meta[property="og:description"]');
            if (ogDescription) ogDescription.setAttribute('content', data.data.caption || `Read ${data.data.title}`);

            const ogImage = document.querySelector('meta[property="og:image"]');
            if (ogImage && data.data.images && data.data.images.length > 0) {
              ogImage.setAttribute('content', data.data.images[0].image_url);
            }

            const ogUrl = document.querySelector('meta[property="og:url"]');
            if (ogUrl) ogUrl.setAttribute('content', window.location.href);
          }
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

  const handleShare = (platform: string) => {
    const shareUrl = encodeURIComponent(currentUrl);
    const shareTitle = encodeURIComponent(blog.title);
    const shareText = encodeURIComponent(blog.caption || blog.title);

    let url = '';

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${shareTitle}%20${shareUrl}`;
        break;
      case 'email':
        url = `mailto:?subject=${shareTitle}&body=${shareText}%0A%0A${shareUrl}`;
        break;
      default:
        return;
    }

    if (platform === 'email') {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = () => {
    const urlToCopy = currentUrl || window.location.href;
    navigator.clipboard.writeText(urlToCopy).then(() => {
      alert('Link copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy:', err);
      const textArea = document.createElement('textarea');
      textArea.value = urlToCopy;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link copied to clipboard!');
    });
  };

  // Generate JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "image": blog.images && blog.images.length > 0 ? blog.images.map(img => img.image_url) : [],
    "datePublished": blog.created_at,
    "dateModified": blog.created_at,
    "author": {
      "@type": "Person",
      "name": blog.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Vitaway Health",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.vitaway.org/images/logo.png"
      }
    },
    "description": blog.caption || blog.title,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": currentUrl
    },
    "articleSection": blog.category.name
  };

  return (
    <GuestLayout>
      {/* SEO Meta Tags */}
      <Head>
        <title>{blog.title} | Vitaway Health Blog</title>
        <meta name="description" content={blog.caption || `Read ${blog.title} by ${blog.author} on Vitaway Health`} />
        <meta name="keywords" content={`${blog.category.name}, health, wellness, nutrition, vitaway, ${blog.title.toLowerCase()}`} />
        <meta name="author" content={blog.author} />
        <meta name="article:published_time" content={blog.created_at} />
        <meta name="article:author" content={blog.author} />
        <meta name="article:section" content={blog.category.name} />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.caption || `Read ${blog.title} by ${blog.author}`} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content="Vitaway Health" />
        {blog.images && blog.images.length > 0 && (
          <meta property="og:image" content={blog.images[0].image_url} />
        )}
        <meta property="og:image:alt" content={blog.title} />
        <meta property="article:published_time" content={blog.created_at} />
        <meta property="article:author" content={blog.author} />
        <meta property="article:section" content={blog.category.name} />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@VitawayHealth" />
        <meta name="twitter:creator" content="@VitawayHealth" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.caption || `Read ${blog.title}`} />
        {blog.images && blog.images.length > 0 && (
          <meta name="twitter:image" content={blog.images[0].image_url} />
        )}

        {/* Canonical URL */}
        <link rel="canonical" href={currentUrl} />
      </Head>

      {/* JSON-LD Structured Data for SEO */}
      <Script id="blog-structured-data" type="application/ld+json">
        {JSON.stringify(structuredData)}
      </Script>

      <article className="relative border-t border-gray-200" itemScope itemType="https://schema.org/BlogPosting">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded">
          <header>
            <p className="text-indigo-600 text-sm mb-2 font-semibold" itemProp="articleSection">{blog.category.name}</p>
            <h1 className="text-gray-900 font-bold text-4xl mb-3 capitalize" itemProp="headline">{blog.title}</h1>

            {/* Hidden meta for SEO */}
            <meta itemProp="image" content={blog.images && blog.images.length > 0 ? blog.images[0].image_url : ''} />
            <meta itemProp="datePublished" content={blog.created_at} />
            <meta itemProp="dateModified" content={blog.created_at} />
            <div itemProp="publisher" itemScope itemType="https://schema.org/Organization" style={{ display: 'none' }}>
              <meta itemProp="name" content="Vitaway Health" />
              <div itemProp="logo" itemScope itemType="https://schema.org/ImageObject">
                <meta itemProp="url" content="https://www.vitaway.org/images/logo.png" />
              </div>
            </div>

            <div className="text-sm text-gray-600 flex flex-wrap gap-4 mb-4">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M20.75 13.25c0 4.83-3.92 8.75-8.75 8.75s-8.75-3.92-8.75-8.75S7.17 4.5 12 4.5s8.75 3.92 8.75 8.75Z" />
                  <path d="M12 8v5" opacity=".4" />
                  <path d="M9 2h6" opacity=".4" />
                </svg>
                <time dateTime={blog.created_at || new Date().toISOString()} itemProp="datePublished">
                  {new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                    Math.round((new Date(blog.created_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
                    'day'
                  )}
                </time>
              </span>

              <span className="flex items-center gap-1" itemProp="author" itemScope itemType="https://schema.org/Person">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
                  <path d="M20.59 22c0-3.87-3.85-7-8.59-7s-8.59 3.13-8.59 7" opacity=".4" />
                </svg>
                <span itemProp="name">{blog.author}</span>
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
          {/* Social Share Section */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Share this article:</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                aria-label="Share on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>

              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-600 text-white rounded-lg transition-colors duration-200"
                aria-label="Share on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </button>

              <button
                onClick={() => handleShare('linkedin')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-800 hover:bg-blue-800 text-white rounded-lg transition-colors duration-200"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>

              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                aria-label="Share on WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </button>

              <button
                onClick={() => handleShare('email')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                aria-label="Share via Email"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>

              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                aria-label="Copy link"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <ImageSlider images={blog.images.map((img) => img.image_url)} alt={blog.title} />
          </div>

          {/* Blog Content */}
          <section className="blog-content prose prose-lg max-w-none text-gray-800 blog-content mb-8" itemProp="articleBody" dangerouslySetInnerHTML={{ __html: blog.content }} />

          {/* Disclaimer Section - Only show if disclaimer exists */}
          {blog.disclaimer && (
            <div className="mt-8 p-6 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-amber-900 mb-2">Disclaimer</h3>
                  <div className="text-sm text-amber-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: blog.disclaimer }} />
                </div>
              </div>
            </div>
          )}

          {/* Author Info & Call to Action */}
          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
            <div className="flex items-center gap-4 mb-4">
              <div>
                <p className="text-lg font-semibold text-gray-900">Written by {blog.author}</p>
                <p className="text-sm text-gray-600">Health & Wellness Expert at Vitaway Health</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-indigo-200">
              <p className="text-sm text-gray-700 mb-3">
                Want personalized health guidance? Our team of experts is here to help you achieve your wellness goals and mantain a balanced lifestyle.
              </p>
              <Link
                href="/appointments"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-b from-[#003E48] to-[#282e33] text-white font-medium rounded-lg transition-colors duration-200"
              >
                <span>Book a Consultation</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Social Media Follow Section */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Follow Vitaway Health</h3>
            <p className="text-sm text-gray-600 mb-4">Stay updated with the latest health tips and wellness insights</p>
            <div className="flex justify-center gap-4">
              <a
                href="Facebook: https://www.facebook.com/VitawayEClinic/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-200"
                aria-label="Follow us on Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="X: https://x.com/Vitawayeclinic"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-sky-500 hover:bg-sky-600 text-white rounded-full transition-colors duration-200"
                aria-label="Follow us on Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/vitaway-e-clinic-ba1009206/?originalSubdomain=rw"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white rounded-full transition-colors duration-200"
                aria-label="Follow us on LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/vitawayeclinic/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white rounded-full transition-colors duration-200"
                aria-label="Follow us on Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </article>
    </GuestLayout>
  );
};

export default BlogPost;

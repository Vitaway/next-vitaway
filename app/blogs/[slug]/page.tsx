import React from 'react';
import { notFound } from "next/navigation";
import GuestLayout from '@/app/layouts/GuestLayout';

async function fetchBlog(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${slug}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const blog = await fetchBlog(params.slug);

  if (!blog) return notFound();

  return (<>
    <GuestLayout>
      <div className="relative p-4">
        <div className="max-w-3xl mx-auto">
          <div className="mt-3 bg-white rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal">
            <div className="">

              <a href="#" className="text-indigo-600 hover:text-gray-700 transition duration-500 ease-in-out text-sm">
                Election
              </a>

              <h1 className="text-gray-900 font-bold text-4xl">{blog.title}</h1>

              <div className="py-5 text-sm font-regular text-gray-900 flex">
                <span className="mr-3 flex flex-row items-center">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20.75 13.25c0 4.83-3.92 8.75-8.75 8.75s-8.75-3.92-8.75-8.75S7.17 4.5 12 4.5s8.75 3.92 8.75 8.75Z" stroke="#697689" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path opacity=".4" d="M12 8v5" stroke="#697689" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path opacity=".4" d="M9 2h6" stroke="#697689" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                  </span>
                  <span className="ml-1">6 mins ago</span>
                </span>

                <a href="#" className="flex flex-row items-center hover:text-indigo-600  mr-3">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke="#697689" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path opacity=".4" d="M20.59 22c0-3.87-3.85-7-8.59-7s-8.59 3.13-8.59 7" stroke="#697689" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                  </span>
                  <span className="ml-1">{blog.author}</span></a>

                <a href="#" className="flex flex-row items-center hover:text-indigo-600">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="m4.17 15.3 4.53 4.53a4.78 4.78 0 0 0 6.75 0l4.39-4.39a4.78 4.78 0 0 0 0-6.75L15.3 4.17a4.75 4.75 0 0 0-3.6-1.39l-5 .24c-2 .09-3.59 1.68-3.69 3.67l-.24 5c-.06 1.35.45 2.66 1.4 3.61Z" stroke="#697689" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path opacity=".4" d="M9.5 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="#697689" stroke-width="1.5" stroke-linecap="round"></path></svg>
                  </span>
                  <span className="ml-1">activewear</span></a>
              </div>

              <hr />

              <div className='blog-content'>
                {blog.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  </>)
};
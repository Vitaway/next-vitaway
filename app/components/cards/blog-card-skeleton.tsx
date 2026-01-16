import React from 'react';

function BlogCardSkeleton() {
  return (
    <div className="">
      {/* Image Placeholder */}
      <div className="block aspect-w-4 aspect-h-3 bg-gray-200 rounded-xl"></div>

      {/* Category Placeholder */}
      <div className="inline-flex px-4 py-2 mt-3 bg-gray-200 rounded-full w-24 h-5"></div>

      {/* Title Placeholder */}
      <div className="mt-3 bg-gray-300 h-6 rounded w-3/4"></div>

      {/* Caption Placeholder */}
      <div className="mt-4 space-y-2">
        <div className="bg-gray-200 h-4 rounded w-full"></div>
        <div className="bg-gray-200 h-4 rounded w-5/6"></div>
        <div className="bg-gray-200 h-4 rounded w-4/6"></div>
      </div>

      {/* Divider Placeholder */}
      <div className="h-0 mt-6 mb-4 border-t-2 border-gray-200 border-dashed"></div>

      {/* Date Placeholder */}
      <div className="bg-gray-200 h-4 rounded w-1/3"></div>
    </div>
  );
}

export default BlogCardSkeleton;
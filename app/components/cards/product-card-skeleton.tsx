import React from 'react';

function ProductCardSkeleton() {
    return (
        <div className="relative rounded-2xl border bg-white border-gray-200 animate-pulse">
            <div className="flex-auto">
                {/* Image Placeholder */}
                <div className="text-center relative flex justify-center">
                    <div className="w-full h-[170px] overflow-hidden rounded-t-2xl border-b border-gray-200 bg-gray-200"></div>
                </div>

                {/* Content Placeholder */}
                <div className="flex flex-col px-3 py-4">
                    {/* Category Placeholder */}
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>

                    {/* Title Placeholder */}
                    <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>

                    {/* Description Placeholder */}
                    <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>

                    {/* Rating Placeholder */}
                    <div className="flex items-center mt-2">
                        <div className="flex flex-row gap-3">
                            <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                            <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                            <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                            <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                            <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                        </div>
                        <div className="flex flex-row gap-1 ml-3">
                            <div className="h-4 bg-gray-200 rounded w-6"></div>
                            <div className="h-4 bg-gray-200 rounded w-10"></div>
                        </div>
                    </div>

                    {/* Price and Button Placeholder */}
                    <div className="flex justify-between items-center mt-5">
                        <div className="h-5 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCardSkeleton;
import { useCart } from '@/context/CartContext';
import { Products } from '@/types/products';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const ProductCard = React.memo(function ProductCard({ product }: { product: Products }) {
    const { addToCart } = useCart();

    return (
        <div className="relative overflow-hidden rounded-[24px] bg-white">
            <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[#F6F3EE]">
                <Link href={`/shop/${product.slug}`} className="h-full w-full">
                    {typeof product.images[0] === 'object' && product.images[0] !== null ? (
                        <Image
                            width={500}
                            height={500}
                            src={product.images[0].image_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                    ) : null}
                </Link>
            </div>

            <div className="flex flex-col px-4 py-4">
                <Link href={`/shop/${product.slug}`} className="text-xs font-medium text-[#003E48]/50">
                    {product.category.name}
                </Link>

                <Link href={`/shop/${product.slug}`}>
                    <h3 className="mt-1 truncate text-base font-bold text-[#003E48]">{product.name}</h3>
                    <div
                        className="mt-2 line-clamp-2 text-sm text-[#003E48]/65"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                </Link>

                <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#003E48]">
                        RWF {Number(product.price).toLocaleString()}
                    </span>
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/shop/${product.slug}`}
                            className="inline-flex items-center rounded-full border border-[#003E48]/20 px-3 py-2 text-[#003E48] hover:bg-[#F6F3EE]"
                            aria-label={`View ${product.name}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M15.582 12.002c0 1.98-1.6 3.58-3.58 3.58s-3.58-1.6-3.58-3.58 1.6-3.58 3.58-3.58 3.58 1.6 3.58 3.58Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M12 20.269c3.53 0 6.82-2.08 9.11-5.68.9-1.41.9-3.78 0-5.19-2.29-3.6-5.58-5.68-9.11-5.68-3.53 0-6.82 2.08-9.11 5.68-.9 1.41-.9 3.78 0 5.19 2.29 3.6 5.58 5.68 9.11 5.68Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </Link>
                        <button
                            type="button"
                            onClick={() => addToCart(product)}
                            className="inline-flex items-center rounded-full bg-[#E85A2E] px-3 py-2 text-white hover:bg-[#d14e26]"
                            aria-label={`Add ${product.name} to cart`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M8.4 6.5h7.2c3.4 0 3.74 1.59 3.97 3.53l.9 7.5C20.76 19.99 20 22 16.5 22H7.51C4 22 3.24 19.99 3.54 17.53l.9-7.5C4.66 8.09 5 6.5 8.4 6.5Z"
                                    stroke="#ffffff"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    opacity=".4"
                                    d="M8 8V4.5C8 3 9 2 10.5 2h3C15 2 16 3 16 4.5V8M20.41 17.031H8"
                                    stroke="#ffffff"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ProductCard;

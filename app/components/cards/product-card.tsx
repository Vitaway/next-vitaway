import { useCart } from '@/context/CartContext';
import { Products } from '@/types/products';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const ProductCard = React.memo(function ProductCard({ product }: { product: Products }) {
    const { addToCart } = useCart();
    const image = typeof product.images[0] === 'object' && product.images[0] !== null ? product.images[0] : null;

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_14px_40px_rgba(0,62,72,0.10)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(0,62,72,0.16)]">
            <Link href={`/shop/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-[#F6F3EE]">
                {image ? (
                    <Image
                        width={640}
                        height={800}
                        src={image.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                ) : null}
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-[#003E48] shadow-sm">
                    {product.category.name}
                </span>
            </Link>

            <div className="flex flex-1 flex-col p-5">
                <Link href={`/shop/${product.slug}`}>
                    <h3 className="line-clamp-2 text-lg font-bold leading-snug text-[#003E48]">{product.name}</h3>
                    <div
                        className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#003E48]/65"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                </Link>

                <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                    <p className="text-base font-bold text-[#003E48]">
                        RWF {Number(product.price).toLocaleString()}
                    </p>
                    <button
                        type="button"
                        onClick={() => addToCart(product)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#E85A2E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d14e26]"
                        aria-label={`Add ${product.name} to cart`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path
                                d="M8.4 6.5h7.2c3.4 0 3.74 1.59 3.97 3.53l.9 7.5C20.76 19.99 20 22 16.5 22H7.51C4 22 3.24 19.99 3.54 17.53l.9-7.5C4.66 8.09 5 6.5 8.4 6.5Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M8 8V4.5C8 3 9 2 10.5 2h3C15 2 16 3 16 4.5V8"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Add
                    </button>
                </div>
            </div>
        </article>
    );
});

export default ProductCard;

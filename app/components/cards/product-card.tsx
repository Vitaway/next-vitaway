import { useCart } from '@/context/CartContext';
import { Products } from '@/types/products'
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

function ProductCard({ product }: { product: Products }) {
    const { addToCart } = useCart();

    return (<>
        <div className="relative rounded-2xl border bg-white border-gray-200 transform transition-transform duration-300 hover:scale-105">
            <div className="flex-auto">
                <div className="text-center relative flex justify-center">
                    <div className='w-full h-60 overflow-hidden rounded-t-2xl border-b border-gray-200 flex justify-center items-center bg-gray-100'>
                        {typeof product.images[0] === 'object' && product.images[0] !== null ? (
                            <Image
                                width={500}
                                height={500}
                                src={product.images[0].image_url}
                                alt={product.name}
                                className="object-cover w-full h-full"
                            />
                        ) : null}
                    </div>
                </div>

                <div className="flex flex-col px-3 py-4">
                    <Link href={`/shop/${product.slug}`} className="text-decoration-none text-gray-500">
                        <small>{product.category.name}</small>
                    </Link>

                    <Link href={`/shop/${product.slug}`}>
                        <div className="flex flex-col">
                            <h3 className="text-base truncate"><span className='text-slate-800 font-bold'>{product.name}</span></h3>
                            <div className='font-semibold text-sm text-slate-700 line-clamp-2 mt-2' dangerouslySetInnerHTML={{ __html: product.description }}></div>
                        </div>
                    </Link>

                    <div className="flex justify-between items-center mt-5">
                        <div className='text-sm'>
                            <span className="text-gray-900 font-semibold">RWF {Number(product.price).toLocaleString()}</span>
                        </div>
                        <div>
                            <Link href={`/shop/${product.slug}`} type="button" className="inline-flex cursor-pointer px-3 py-2 rounded-md text-sm items-center gap-x-1 bg-white hover:bg-[#272749] text-[#272749] hover:text-white disabled:opacity-50 disabled:pointer-events-none focus:outline-none border border-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path opacity=".4" d="M15.582 12.002c0 1.98-1.6 3.58-3.58 3.58s-3.58-1.6-3.58-3.58 1.6-3.58 3.58-3.58 3.58 1.6 3.58 3.58Z" stroke="#697689" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12 20.269c3.53 0 6.82-2.08 9.11-5.68.9-1.41.9-3.78 0-5.19-2.29-3.6-5.58-5.68-9.11-5.68-3.53 0-6.82 2.08-9.11 5.68-.9 1.41-.9 3.78 0 5.19 2.29 3.6 5.58 5.68 9.11 5.68Z" stroke="#697689" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                            </Link>
                            <button type="button" onClick={() => addToCart(product)} className="inline-flex cursor-pointer px-3 py-2 rounded-md ml-2 text-sm items-center gap-x-1 bg-[#272749] hover:bg-[#272749]/90 text-white disabled:opacity-50 disabled:pointer-events-none hover:text-white focus:outline-none focus:ring-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M8.4 6.5h7.2c3.4 0 3.74 1.59 3.97 3.53l.9 7.5C20.76 19.99 20 22 16.5 22H7.51C4 22 3.24 19.99 3.54 17.53l.9-7.5C4.66 8.09 5 6.5 8.4 6.5Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M8 8V4.5C8 3 9 2 10.5 2h3C15 2 16 3 16 4.5V8M20.41 17.031H8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default ProductCard
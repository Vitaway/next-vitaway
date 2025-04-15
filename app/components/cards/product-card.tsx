import { useCart } from '@/context/CartContext';
import { Products } from '@/types/products'
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

function ProductCard({ product }: { product: Products }) {
    const { addToCart } = useCart();

    return (<>
        <div className="relative rounded-2xl border bg-white border-gray-200">
            <div className="flex-auto">
                <div className="text-center relative flex justify-center">
                    <div className='w-full h-[170px] overflow-hidden rounded-t-2xl border-b border-gray-200'>
                        {typeof product.images[0] === 'object' && product.images[0] !== null ? (
                            <Image width={500} height={500} src={product.images[0].image_url} alt={product.name} className="w-full h-full object-cover" />
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
                            <p className='font-semibold text-sm text-slate-700 line-clamp-2 mt-2'>{product.description}</p>
                        </div>
                    </Link>

                    <div className="flex justify-between items-center mt-5">
                        <div className='text-sm'>
                            <span className="text-gray-900 font-semibold">RWF {Number(product.price).toLocaleString()}</span>
                        </div>
                        <div>
                            <button type="button" onClick={() => addToCart(product)} className="inline-flex cursor-pointer px-3 py-1 rounded-md text-sm items-center gap-x-1 bg-[#272749] hover:bg-[#272749]/90 text-white disabled:opacity-50 disabled:pointer-events-none hover:text-white focus:outline-none focus:ring-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path opacity=".4" d="M6 12h12" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12 18V6" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                <span>Add</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default ProductCard
import { useCart } from '@/context/CartContext';
import { Products } from '@/types/products'
import Image from 'next/image'
import React from 'react'

function ProductCard({ product }: { product: Products}) {
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
                    <a href="#!" className="text-decoration-none text-gray-500"><small>{ product.category.name }</small></a>

                    <div className="flex flex-col">
                        <h3 className="text-base truncate"><a href="#!" className='text-slate-800 font-bold'>{ product.name}</a></h3>
                        <p className='font-semibold text-sm text-slate-700 line-clamp-2 mt-2'>{ product.description }</p>

                        <div className="flex items-center mt-2">
                            <div className="flex flex-row gap-3">
                                <small className="text-yellow-500 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-star-filled"
                                        width="14" height="14" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path
                                            d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                                            strokeWidth="0" fill="currentColor" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-star-filled"
                                        width="14" height="14" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path
                                            d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                                            strokeWidth="0" fill="currentColor" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-star-filled"
                                        width="14" height="14" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path
                                            d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                                            strokeWidth="0" fill="currentColor" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-star-filled"
                                        width="14" height="14" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path
                                            d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                                            strokeWidth="0" fill="currentColor" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-star-half-filled"
                                        width="14" height="14" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path
                                            d="M12 1a.993 .993 0 0 1 .823 .443l.067 .116l2.852 5.781l6.38 .925c.741 .108 1.08 .94 .703 1.526l-.07 .095l-.078 .086l-4.624 4.499l1.09 6.355a1.001 1.001 0 0 1 -1.249 1.135l-.101 -.035l-.101 -.046l-5.693 -3l-5.706 3c-.105 .055 -.212 .09 -.32 .106l-.106 .01a1.003 1.003 0 0 1 -1.038 -1.06l.013 -.11l1.09 -6.355l-4.623 -4.5a1.001 1.001 0 0 1 .328 -1.647l.113 -.036l.114 -.023l6.379 -.925l2.853 -5.78a.968 .968 0 0 1 .904 -.56zm0 3.274v12.476a1 1 0 0 1 .239 .029l.115 .036l.112 .05l4.363 2.299l-.836 -4.873a1 1 0 0 1 .136 -.696l.07 -.099l.082 -.09l3.546 -3.453l-4.891 -.708a1 1 0 0 1 -.62 -.344l-.073 -.097l-.06 -.106l-2.183 -4.424z"
                                            strokeWidth="0" fill="currentColor" />
                                    </svg>
                                </small>
                                <div className="flex flex-row gap-1">
                                    <span className="text-gray-500 text-sm">4.5</span>
                                    <span className="text-gray-500 text-sm">(149)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-5">
                        <div className='text-sm'>
                            <span className="text-gray-900 font-semibold">RWF { Number(product.price).toLocaleString() }</span>
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
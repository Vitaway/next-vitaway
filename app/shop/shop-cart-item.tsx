import Image from 'next/image'
import React from 'react'

function ShopCartItem() {
    return (<>
        <li className="py-3 border-b border-gray-200">
            <div className="flex items-center">
                <div className="w-1/2 md:w-1/2 lg:w-3/5">
                    <div className="flex">
                        <Image width={500} height={500} src="https://images.unsplash.com/photo-1741851374430-d242e0dcd70c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Ecommerce" className="w-10 h-10 rounded-lg" />

                        <div className="ml-3">
                            <a href="#!" className="text-inherit">
                                <h6>Vitamin Supplements</h6>
                            </a>

                            <span><small className="text-gray-500">.98 / lb</small></span>

                            <div className="mt-2 small leading-none">
                                <a href="#!" className="text-green-600 flex items-center">
                                    <span className="mr-1 align-text-bottom">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-trash" width="14"
                                            height="14" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                            stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M4 7l16 0" />
                                            <path d="M10 11l0 6" />
                                            <path d="M14 11l0 6" />
                                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                        </svg>
                                    </span>
                                    <span className="text-gray-500 text-sm">Remove</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-1/3 md:w-1/4 lg:w-1/5">
                    <div className="input-group input-spinner border border-gray-200 rounded-lg flex justify-between items-center">
                        <input type="button" value="-" className="button-minus w-8 border-r cursor-pointer border-gray-300" data-field="quantity" />
                        <input type="number" step="1" max="10" value="1" name="quantity" className="quantity-field w-9 px-2 text-center h-5 border-0 bg-transparent" />
                        <input type="button" value="+" className="button-plus w-8 border-l cursor-pointer border-gray-300" data-field="quantity" />
                    </div>
                </div>

                <div className="w-1/5 text-center md:w-1/5">
                    <span className="font-bold text-gray-800 text-sm">$5.00</span>
                </div>
            </div>
        </li>
    </>)
}

export default ShopCartItem
'use client';

import { useCart } from '@/context/CartContext';
import { Products } from '@/types/products';
import Image from 'next/image';

interface Props {
    product: Products;
    onRemoveFromCart: (productId: string | number) => void;
}

function ShopCartItem({ product, onRemoveFromCart }: Props) {
    const { increaseQuantity, decreaseQuantity, updateQuantity } = useCart();

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const quantity = parseInt(value, 10);

        if (!isNaN(quantity) && quantity >= 1) {
            updateQuantity(product.id, quantity);
        }
    };

    return (
        <li className="border-b border-[#003E48]/10 py-4">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex w-full items-start sm:w-3/5">
                    <Image
                        width={60}
                        height={60}
                        src={product.images[0].image_url}
                        alt={product.name}
                        className="h-14 w-14 flex-shrink-0 rounded-[16px] object-cover"
                    />
                    <div className="ml-4 flex-1">
                        <h6 className="line-clamp-2 text-sm font-semibold text-[#003E48]">{product.name}</h6>
                        <div className="mt-2 line-clamp-2 max-w-full text-xs text-[#003E48]/55 sm:max-w-52" dangerouslySetInnerHTML={{ __html: product.description }}></div>

                        <button onClick={() => onRemoveFromCart(product.id)} className="mt-2 flex items-center rounded-full px-2 py-1 text-xs text-[#E85A2E] hover:bg-[#E85A2E]/8">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".34" d="m8.5 4.97.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="m18.85 9.14-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".34" d="M10.33 16.5h3.33M9.5 12.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                            <span className="ml-2">Remove</span>
                        </button>
                    </div>
                </div>

                <div className="flex w-full items-center justify-between rounded-full bg-[#F6F3EE] px-2 py-1 sm:w-auto sm:justify-center">
                    <button
                        onClick={() => decreaseQuantity(product.id)}
                        className="px-2 text-[#003E48] hover:text-[#003E48]/70"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>
                    <input
                        type="number"
                        min={1}
                        max={10}
                        value={product.quantity}
                        onChange={handleQuantityChange}
                        className="w-12 border-0 bg-transparent text-center text-sm text-[#003E48]"
                    />
                    <button
                        onClick={() => increaseQuantity(product.id)}
                        className="px-2 text-[#003E48] hover:text-[#003E48]/70"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>

                <div className="w-full text-center text-sm font-semibold text-[#003E48] sm:w-24">
                    RWF {Number(product.price).toLocaleString()}
                </div>
            </div>
        </li>
    );
}

export default ShopCartItem;

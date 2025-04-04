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
        <li className="py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Product Info */}
                <div className="flex items-start w-full sm:w-3/5">
                    <Image
                        width={60}
                        height={60}
                        src={product.images[0].image_url}
                        alt={product.name}
                        className="rounded-lg object-cover w-14 h-14"
                    />
                    <div className="ml-4">
                        <h6 className="font-semibold text-sm">{product.name}</h6>
                        <p className="text-xs text-gray-500 line-clamp-2 max-w-52 mt-2">{product.description}</p>
                        
                        <button onClick={() => onRemoveFromCart(product.id)} className="text-red-600 text-xs mt-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98" stroke="#f47373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path opacity=".34" d="m8.5 4.97.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3" stroke="#f47373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="m18.85 9.14-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14" stroke="#f47373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path opacity=".34" d="M10.33 16.5h3.33M9.5 12.5h5" stroke="#f47373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            Remove
                        </button>
                    </div>
                </div>

                {/* Quantity Control */}
                <div className="flex items-center border border-gray-300 rounded-md px-2 py-1">
                    <button
                        onClick={() => decreaseQuantity(product.id)}
                        className="px-2 text-gray-700 hover:text-black"
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
                        className="w-12 text-center text-sm border-0 bg-transparent"
                    />
                    <button
                        onClick={() => increaseQuantity(product.id)}
                        className="px-2 text-gray-700 hover:text-black"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>

                {/* Price */}
                <div className="text-sm font-semibold text-gray-800 w-24 text-center">
                    RWF {Number(product.price).toLocaleString()}
                </div>
            </div>
        </li>
    );
}

export default ShopCartItem;

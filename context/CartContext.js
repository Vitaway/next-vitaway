'use client';
import AlertMessage from '@/app/components/alerts/alert-message';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState(null);
  const [type, setType] = useState(null);

  useEffect(() => {
    const loadCart = async () => {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(storedCart);
    };
    loadCart();
  }, []);

  const saveCartToLocalStorage = async (updatedCart) => {
    await localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const addToCart = async (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id);

      if (existing) {
        setType('success');
        setMessage(item.name + ' quantity updated!');

        const updatedCart = prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
        saveCartToLocalStorage(updatedCart);
        return updatedCart;
      }

      setType('success');
      setMessage(item.name + ' added to cart!');

      const updatedCart = [...prevCart, { ...item, quantity: 1 }];
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = async (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== id);
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
    setType('error');
    setMessage('Item removed from cart!');
  };

  const clearCart = async () => {
    setCart([]);
    await localStorage.removeItem('cart');
  };

  const checkout = async () => {
    await clearCart();
  };

  const increaseQuantity = async (id) => {
    setCart((prev) => {
      const updatedCart = prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  const decreaseQuantity = async (id) => {
    setCart((prev) => {
      const updatedCart = prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  const updateQuantity = async (id, quantity) => {
    setCart((prev) => {
      const updatedCart = prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        checkout,
        increaseQuantity,
        decreaseQuantity,
        updateQuantity,
      }}
    >
      {children}

      <AlertMessage message={message} type={type} />
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
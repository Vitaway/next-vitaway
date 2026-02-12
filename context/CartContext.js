"use client";
import AlertMessage from "@/app/components/alerts/alert-message";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState(null);
  const [type, setType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
      } catch (error) {
        console.error("Error loading cart:", error);
        setCart([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, []);

  const saveCartToLocalStorage = (updatedCart) => {
    try {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error saving cart:", error);
      setType("error");
      setMessage("Failed to save cart. Please try again.");
    }
  };

  const addToCart = (item, quantity = 1) => {
    if (!item || !item.id) {
      setType("error");
      setMessage("Invalid item");
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id);

      if (existing) {
        setType("success");
        setMessage(item.name + " quantity updated!");

        const updatedCart = prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i,
        );
        saveCartToLocalStorage(updatedCart);
        return updatedCart;
      }

      setType("success");
      setMessage(item.name + " added to cart!");

      const updatedCart = [...prevCart, { ...item, quantity }];
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== id);
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
    setType("error");
    setMessage("Item removed from cart!");
  };

  const clearCart = () => {
    try {
      setCart([]);
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("Error clearing cart:", error);
      setType("error");
      setMessage("Failed to clear cart");
    }
  };

  const checkout = () => {
    clearCart();
  };

  const increaseQuantity = (id) => {
    setCart((prev) => {
      const updatedCart = prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      );
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  const decreaseQuantity = (id) => {
    setCart((prev) => {
      const updatedCart = prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;

    setCart((prev) => {
      const updatedCart = prev.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      );
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
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

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

// context/CartContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  // If user is not logged in, return empty cart and no-op functions
  if (!user) {
    return (
      <CartContext.Provider
        value={{
          cartItems: [],
          cartCount: 0,
          addToCart: () => {},
          updateQuantity: () => {},
          removeItem: () => {},
          clearCart: () => {},
        }}
      >
        {children}
      </CartContext.Provider>
    );
  }

  const cartKey = `cart_${user.id}`;

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCartItems(stored);
  }, [cartKey]);

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, cartKey]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const index = prev.findIndex((i) => i._id === item._id);
      if (index !== -1) {
        const updated = [...prev];
        const addQty = item.quantity && item.quantity > 0 ? item.quantity : 1;
        updated[index].quantity += addQty;
        return updated;
      } else {
        return [...prev, { ...item, quantity: item.quantity && item.quantity > 0 ? item.quantity : 1 }];
      }
    });
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeItem(id);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, quantity: newQty } : item
        )
      );
    }
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(cartKey);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, addToCart, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

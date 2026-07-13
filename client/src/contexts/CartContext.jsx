import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  function authHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-User-Id': user ? String(user.id) : '',
    };
  }

  const fetchCart = useCallback(async () => {
    if (!user) { setItems([]); return; }
    try {
      const res = await fetch('/api/cart', { headers: authHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      // silently ignore network errors
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  async function addToCart(productId, quantity = 1) {
    if (!user) throw new Error('Please log in to add items to your cart.');
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add to cart.');
    setItems(data.items);
  }

  async function updateQty(productId, quantity) {
    if (!user) return;
    const res = await fetch(`/api/cart/${productId}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ quantity }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update cart.');
    setItems(data.items);
  }

  async function removeItem(productId) {
    if (!user) return;
    const res = await fetch(`/api/cart/${productId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to remove item.');
    setItems(data.items);
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, itemCount, fetchCart, addToCart, updateQty, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

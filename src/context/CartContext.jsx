import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const CART_KEY = 'poster_galaxy_cart_v1'

const CartContext = createContext(null)

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)

  useEffect(() => {
    saveCart(items)
  }, [items])

  const addItem = useCallback((payload) => {
    const {
      productId,
      name,
      imageUrl,
      size,
      price,
      qty = 1,
      category,
    } = payload
    setItems((prev) => {
      const i = prev.findIndex(
        (x) =>
          x.productId === productId &&
          x.size === size
      )
      if (i >= 0) {
        const next = [...prev]
        next[i] = { ...next[i], qty: next[i].qty + qty }
        return next
      }
      return [
        ...prev,
        {
          id: `${productId}-${size}-${Date.now()}`,
          productId,
          name,
          imageUrl,
          size,
          price: Number(price),
          qty,
          category: category || '',
        },
      ]
    })
  }, [])

  const updateQty = useCallback((lineId, qty) => {
    setItems((prev) =>
      prev
        .map((x) => (x.id === lineId ? { ...x, qty: Math.max(1, qty) } : x))
        .filter((x) => x.qty > 0)
    )
  }, [])

  const removeLine = useCallback((lineId) => {
    setItems((prev) => prev.filter((x) => x.id !== lineId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    try {
      sessionStorage.removeItem('poster_galaxy_session_coupon_v1')
    } catch {
      /* ignore */
    }
  }, [])

  const subtotal = useMemo(
    () => items.reduce((s, x) => s + x.price * x.qty, 0),
    [items]
  )

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQty,
      removeLine,
      clearCart,
      subtotal,
      cartCount: items.reduce((n, x) => n + x.qty, 0),
    }),
    [items, addItem, updateQty, removeLine, clearCart, subtotal]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

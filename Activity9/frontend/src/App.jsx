import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Navigation from './components/Navigation'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import * as api from './services/api'
import { mockProducts } from './data/mockData'

// Set to true to use mock data, false for real API
const USE_MOCK = true

export default function App() {
  const [activeTab, setActiveTab] = useState('products')
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)

  // Load initial data
  useEffect(() => {
    loadProducts()
    if (!USE_MOCK) {
      loadCart()
      loadOrders()
    }
  }, [])

  // Load products
  const loadProducts = async () => {
    setLoading(true)
    try {
      if (USE_MOCK) {
        await new Promise(r => setTimeout(r, 800))
        setProducts(mockProducts)
      } else {
        const data = await api.getAllProducts()
        setProducts(data)
      }
    } catch (err) {
      toast.error('Failed to load products')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Load cart from API
  const loadCart = async () => {
    try {
      const data = await api.getCart()
      setCart(data.items || [])
    } catch (err) {
      console.error('Failed to load cart:', err)
    }
  }

  // Load orders from API
  const loadOrders = async () => {
    try {
      const data = await api.getAllOrders()
      setOrders(data || [])
    } catch (err) {
      console.error('Failed to load orders:', err)
    }
  }

  // Add product to cart
  const handleAddToCart = async (product) => {
    if (USE_MOCK) {
      const existing = cart.find((item) => item.product._id === product._id)
      if (existing) {
        toast.info('Item already in cart')
        return
      }
      setCart([...cart, { product, quantity: 1 }])
      toast.success(`${product.name} added to cart!`)
    } else {
      try {
        const data = await api.addToCart(product._id, 1)
        setCart(data.items || [])
        toast.success(`${product.name} added to cart!`)
      } catch (err) {
        toast.error(err.message || 'Failed to add to cart')
      }
    }
  }

  // Update cart item quantity
  const handleUpdateQuantity = async (productId, newQty) => {
    if (newQty < 1) return

    if (USE_MOCK) {
      setCart(
        cart.map((item) =>
          item.product._id === productId ? { ...item, quantity: newQty } : item
        )
      )
    } else {
      try {
        const data = await api.updateCartItem(productId, newQty)
        setCart(data.items || [])
      } catch (err) {
        toast.error(err.message || 'Failed to update quantity')
      }
    }
  }

  // Remove item from cart
  const handleRemoveItem = async (productId) => {
    if (USE_MOCK) {
      const item = cart.find((i) => i.product._id === productId)
      setCart(cart.filter((i) => i.product._id !== productId))
      if (item) toast.info(`${item.product.name} removed from cart`)
    } else {
      try {
        const data = await api.removeFromCart(productId)
        setCart(data.items || [])
        toast.info('Item removed from cart')
      } catch (err) {
        toast.error(err.message || 'Failed to remove item')
      }
    }
  }

  // Clear entire cart
  const handleClearCart = async () => {
    if (cart.length === 0) return

    if (USE_MOCK) {
      setCart([])
      toast.info('Cart cleared')
    } else {
      try {
        await api.clearCart()
        setCart([])
        toast.info('Cart cleared')
      } catch (err) {
        toast.error(err.message || 'Failed to clear cart')
      }
    }
  }

  // Checkout
  const handleCheckout = async () => {
    if (cart.length === 0) return
    setCheckingOut(true)

    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 1500))

      // Check stock availability
      const outOfStock = cart.find((item) => {
        const product = products.find((p) => p._id === item.product._id)
        return !product || product.stock < item.quantity
      })

      if (outOfStock) {
        setCheckingOut(false)
        toast.error(`${outOfStock.product.name} has insufficient stock`)
        return
      }

      // Calculate totals
      const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      const shipping = subtotal > 100 ? 0 : 10
      const tax = subtotal * 0.08
      const total = subtotal + shipping + tax

      // Create order
      const order = {
        _id: 'order_' + Math.random().toString(36).substring(2, 10),
        items: cart.map((item) => ({ ...item })),
        subtotal,
        shipping,
        tax,
        total,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }

      // Update stock
      setProducts(
        products.map((p) => {
          const cartItem = cart.find((i) => i.product._id === p._id)
          if (cartItem) return { ...p, stock: p.stock - cartItem.quantity }
          return p
        })
      )

      setOrders([order, ...orders])
      setCart([])
      setCheckingOut(false)
      setActiveTab('orders')
      toast.success('Order placed successfully!')
    } else {
      try {
        const result = await api.checkout()
        setCart([])
        await loadOrders()
        await loadProducts()
        setCheckingOut(false)
        setActiveTab('orders')
        toast.success('Order placed successfully!')
      } catch (err) {
        setCheckingOut(false)
        toast.error(err.message || 'Checkout failed')
      }
    }
  }

  // Calculate cart item count
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        cartItemCount={cartItemCount}
      />

      <main className="container mx-auto px-4 py-6">
        {activeTab === 'products' && (
          <Products
            products={products}
            cart={cart}
            onAddToCart={handleAddToCart}
            loading={loading}
            query={searchQuery}
          />
        )}

        {activeTab === 'cart' && (
          <Cart
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onCheckout={handleCheckout}
            checkingOut={checkingOut}
            onGoToProducts={() => setActiveTab('products')}
          />
        )}

        {activeTab === 'orders' && (
          <Orders
            orders={orders}
            onGoToProducts={() => setActiveTab('products')}
          />
        )}
      </main>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="bg-slate-800 text-slate-100"
      />
    </div>
  )
}

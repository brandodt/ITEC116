import { useState } from 'react'
import { Filter } from 'react-feather'
import ProductCard from '../components/ProductCard'
import ProductSkeleton from '../components/ProductSkeleton'
import EmptyState from '../components/EmptyState'

const categories = ['All', 'Electronics', 'Clothing', 'Home', 'Sports', 'Books']

export default function Products({ products, cart, onAddToCart, loading, query }) {
  const [category, setCategory] = useState('All')

  // Filter products
  const filtered = products.filter((p) => {
    const matchesCategory = category === 'All' || p.category === category
    const matchesQuery =
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    return matchesCategory && matchesQuery
  })

  // Check if product is in cart
  const isInCart = (productId) => cart.some((item) => item.product._id === productId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Products</h2>
          <p className="text-slate-500">
            {loading ? 'Loading...' : `${filtered.length} products available`}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Filter size={16} className="text-slate-500 flex-shrink-0" />
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                c === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No products found"
          description={
            query
              ? `No products match "${query}"`
              : 'No products in this category'
          }
          action={
            <button
              onClick={() => setCategory('All')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition-colors"
            >
              View All Products
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={onAddToCart}
              isInCart={isInCart(product._id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

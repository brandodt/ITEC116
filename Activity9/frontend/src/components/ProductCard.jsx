import { ShoppingCart, Check, AlertTriangle, Package } from 'react-feather'
import { formatCurrency } from '../utils/format'

export default function ProductCard({ product, onAddToCart, isInCart }) {
  const { name, price, image, stock, category } = product
  const inStock = stock > 0
  const lowStock = stock > 0 && stock <= 5

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-indigo-500/50 transition-colors group">
      {/* Image */}
      <div className="relative aspect-square bg-slate-900 overflow-hidden flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-600">
            <Package size={48} strokeWidth={1} />
            <span className="text-xs mt-2">No Image</span>
          </div>
        )}
        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-slate-300 text-xs font-medium px-2 py-1 rounded-md">
          {category}
        </span>
        {/* Stock Badge */}
        {!inStock && (
          <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center">
            <span className="bg-rose-500/90 text-white text-sm font-semibold px-4 py-2 rounded-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-100 mb-1 truncate">{name}</h3>
        
        {/* Stock Status */}
        <div className="flex items-center gap-1 text-xs mb-3">
          {inStock ? (
            lowStock ? (
              <>
                <AlertTriangle size={12} className="text-amber-500" />
                <span className="text-amber-500">Only {stock} left</span>
              </>
            ) : (
              <>
                <Check size={12} className="text-emerald-500" />
                <span className="text-emerald-500">In Stock ({stock})</span>
              </>
            )
          ) : (
            <>
              <AlertTriangle size={12} className="text-rose-500" />
              <span className="text-rose-500">Out of Stock</span>
            </>
          )}
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-400">
            {formatCurrency(price)}
          </span>
          <button
            onClick={() => onAddToCart?.(product)}
            disabled={!inStock || isInCart}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              !inStock
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : isInCart
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {isInCart ? (
              <>
                <Check size={16} />
                <span className="hidden sm:inline">In Cart</span>
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

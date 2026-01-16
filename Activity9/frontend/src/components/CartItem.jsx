import { Minus, Plus, Trash2, Package } from 'react-feather'
import { formatCurrency } from '../utils/format'

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const { product, quantity } = item
  const subtotal = product.price * quantity
  const maxQty = Math.min(product.stock, 10)

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
      <div className="flex gap-4">
        {/* Image */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0 flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package size={32} className="text-slate-600" strokeWidth={1} />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-100 truncate">{product.name}</h3>
              <p className="text-sm text-slate-500">{product.category}</p>
              <p className="text-indigo-400 font-medium mt-1">
                {formatCurrency(product.price)}
              </p>
            </div>
            <button
              onClick={() => onRemove?.(product._id)}
              className="text-slate-500 hover:text-rose-400 transition-colors p-1"
              title="Remove item"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQuantity?.(product._id, quantity - 1)}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-lg bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center text-slate-100 font-medium">
                {quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity?.(product._id, quantity + 1)}
                disabled={quantity >= maxQty}
                className="w-8 h-8 rounded-lg bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Subtotal */}
            <div className="text-right">
              <p className="text-xs text-slate-500">Subtotal</p>
              <p className="text-lg font-bold text-slate-100">
                {formatCurrency(subtotal)}
              </p>
            </div>
          </div>

          {/* Low Stock Warning */}
          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-xs text-amber-500 mt-2">
              Only {product.stock} left in stock
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

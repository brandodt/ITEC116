import { ShoppingCart, ArrowRight, Trash2 } from 'react-feather'
import CartItem from '../components/CartItem'
import EmptyState from '../components/EmptyState'
import { formatCurrency } from '../utils/format'

export default function Cart({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  checkingOut,
  onGoToProducts,
}) {
  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  if (cart.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        description="Start shopping to add items to your cart"
        action={
          <button
            onClick={onGoToProducts}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition-colors"
          >
            Browse Products
          </button>
        }
      />
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-100">
            Shopping Cart <span className="text-slate-500">({itemCount})</span>
          </h2>
          <button
            onClick={onClearCart}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-rose-400 transition-colors"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        </div>

        <div className="space-y-3">
          {cart.map((item) => (
            <CartItem
              key={item.product._id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemoveItem}
            />
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 sticky top-24">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Order Summary</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal ({itemCount} items)</span>
              <span className="text-slate-200">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'text-emerald-400' : 'text-slate-200'}>
                {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Tax (8%)</span>
              <span className="text-slate-200">{formatCurrency(tax)}</span>
            </div>

            {shipping > 0 && (
              <p className="text-xs text-slate-500 bg-slate-900/50 p-2 rounded-lg">
                💡 Add {formatCurrency(100 - subtotal)} more for free shipping
              </p>
            )}

            <div className="border-t border-slate-700 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-slate-100">Total</span>
                <span className="text-xl font-bold text-indigo-400">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onCheckout}
            disabled={checkingOut}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {checkingOut ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Checkout
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <p className="text-xs text-slate-500 text-center mt-3">
            Secure checkout with 256-bit SSL encryption
          </p>
        </div>
      </div>
    </div>
  )
}

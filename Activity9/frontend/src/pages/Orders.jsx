import { Package, ChevronRight, Clock, CheckCircle, Truck } from 'react-feather'
import EmptyState from '../components/EmptyState'
import { formatCurrency, formatDate } from '../utils/format'

const statusConfig = {
  pending: { color: 'text-amber-400 bg-amber-500/10', icon: Clock, label: 'Pending' },
  processing: { color: 'text-blue-400 bg-blue-500/10', icon: Package, label: 'Processing' },
  shipped: { color: 'text-indigo-400 bg-indigo-500/10', icon: Truck, label: 'Shipped' },
  delivered: { color: 'text-emerald-400 bg-emerald-500/10', icon: CheckCircle, label: 'Delivered' },
}

export default function Orders({ orders, onGoToProducts }) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        description="Complete a checkout to see your orders here"
        action={
          <button
            onClick={onGoToProducts}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition-colors"
          >
            Start Shopping
          </button>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Orders</h2>
        <p className="text-slate-500">{orders.length} order(s)</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = statusConfig[order.status] || statusConfig.pending
          const StatusIcon = status.icon
          const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

          return (
            <div
              key={order._id}
              className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-4 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center">
                    <Package size={20} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-slate-600">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    <StatusIcon size={12} />
                    {status.label}
                  </span>
                  <span className="text-lg font-bold text-indigo-400">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="p-4">
                <p className="text-sm text-slate-500 mb-3">{itemCount} item(s)</p>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {order.items.slice(0, 4).map((item, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-lg bg-slate-900 overflow-hidden flex-shrink-0 flex items-center justify-center"
                    >
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package size={20} className="text-slate-600" />
                      )}
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-slate-400">+{order.items.length - 4}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

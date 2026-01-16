import { ShoppingBag, ShoppingCart, Package, Search } from 'react-feather'

const tabs = [
  { id: 'products', label: 'Products', icon: ShoppingBag },
  { id: 'cart', label: 'Cart', icon: ShoppingCart },
  { id: 'orders', label: 'Orders', icon: Package },
]

export default function Navigation({
  activeTab,
  onTabChange,
  query,
  onQueryChange,
  cartItemCount = 0,
}) {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
              <ShoppingBag size={20} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-slate-100">ShopNest</h1>
              <p className="text-xs text-slate-500">Activity 9</p>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => onQueryChange?.(e.target.value)}
                className="w-full bg-slate-800 text-slate-200 pl-10 pr-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1">
            {tabs.map((t) => {
              const Icon = t.icon
              const active = t.id === activeTab
              const isCart = t.id === 'cart'
              return (
                <button
                  key={t.id}
                  onClick={() => onTabChange?.(t.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{t.label}</span>
                  {isCart && cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => onQueryChange?.(e.target.value)}
              className="w-full bg-slate-800 text-slate-200 pl-10 pr-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}

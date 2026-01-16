export default function ProductSkeleton() {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-slate-700"></div>

      {/* Info Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 bg-slate-700 rounded w-3/4"></div>
        {/* Stock */}
        <div className="h-3 bg-slate-700 rounded w-1/3"></div>
        {/* Price & Button */}
        <div className="flex items-center justify-between pt-1">
          <div className="h-6 bg-slate-700 rounded w-20"></div>
          <div className="h-9 bg-slate-700 rounded w-16"></div>
        </div>
      </div>
    </div>
  )
}

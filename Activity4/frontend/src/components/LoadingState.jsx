import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <Loader2 className="h-16 w-16 text-[#00A2FF] animate-spin" />
      <p className="mt-6 text-[#F5F5F5]">Loading weather data...</p>
    </div>
  );
}

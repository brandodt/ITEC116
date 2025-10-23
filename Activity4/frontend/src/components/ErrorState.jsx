import { AlertCircle } from "lucide-react";

export function ErrorState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="bg-[#121212] rounded-lg p-8 flex flex-col items-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <p className="text-red-500 text-xl">{message}</p>
        <p className="text-[#666666] mt-2">
          Please try again with a different city
        </p>
      </div>
    </div>
  );
}

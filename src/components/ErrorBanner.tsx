"use client";

import { useRouter } from "next/navigation";

type Props = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export default function ErrorBanner({
  title = "Not found",
  message = "We couldn't find the tracking ID you provided. Check the code and try again.",
  onRetry,
}: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-6">
      <div className="max-w-xl text-center bg-white/5 border border-white/10 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-yellow-400 mb-2">{title}</h1>
        <p className="text-sm text-gray-200 mb-6">{message}</p>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => (onRetry ? onRetry() : router.refresh())}
            className="px-4 py-2 bg-yellow-500 text-black rounded-md font-semibold"
          >
            Retry
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 border border-gray-300 rounded-md text-white"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

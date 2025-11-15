"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [trackingCode, setTrackingCode] = useState("");
  const router = useRouter();

  const handleTrackOrder = () => {
    if (trackingCode.trim()) {
      router.push(`/track/${trackingCode.trim()}`);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-white px-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Hero */}
        <section className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Track your VIGO ride instantly
          </h1>
          <p className="text-gray-600 text-lg max-w-prose">
            Enter your tracking code to see real-time status, pickup and drop-off locations, estimated time and payment details.
          </p>

          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => document.getElementById("track-input")?.focus()}
              className="px-5 py-3 bg-yellow-500 text-black font-semibold rounded-lg shadow hover:bg-yellow-600"
            >
              Track an order
            </button>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-sm text-gray-500 underline"
            >
              How tracking works
            </a>
          </div>
        </section>

        {/* Card / CTA */}
        <aside className="w-full flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold mb-2">Track Your Order</h2>
            <p className="text-sm text-gray-500 mb-4">Enter the tracking code you received to view trip details.</p>

            <div className="flex gap-2">
              <input
                id="track-input"
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="e.g. VIGO-AB12CD"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
              <button
                onClick={handleTrackOrder}
                className="px-4 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600"
              >
                Track
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-400">
              Tip: Tracking codes are case-insensitive. If you don't have a code, contact support.
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

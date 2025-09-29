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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Track Your Order</h1>
        <div className="flex space-x-2">
          <input
            type="text"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            placeholder="Enter your tracking code"
            className="flex-grow p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleTrackOrder}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Track
          </button>
        </div>
      </div>
    </div>
  );
}

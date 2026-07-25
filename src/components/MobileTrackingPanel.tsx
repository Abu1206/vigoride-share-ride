"use client";

import { useState } from "react";
import { Order } from "@/types/order";

import Rider from "@/icons/rider";
import Current from "@/icons/location";
import Expand from "@/icons/expand";
import TrackingDetails from "./TrackingDetails";

interface MobileTrackingPanelProps {
  order: Order;
  setFocus: (focus: { type: "pickup" | "dropoff" | "rider" } | null) => void;
  errorMessage: string | null;
  setErrorMessage: (message: string | null) => void;
  formatDateTime: (dateString: string) => string;
  formatCurrency: (amount: number, currency: string) => string;
}

export default function MobileTrackingPanel({
  order,
  setFocus,
  errorMessage,
  setErrorMessage,
  formatDateTime,
  formatCurrency,
}: MobileTrackingPanelProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="md:hidden">
      {/* Mobile Header bar */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between bg-white px-4 py-3 shadow-sm">
        <h1 className="text-xl font-extrabold text-yellow-500 tracking-tight">
          VIGO
        </h1>
        <div className="flex items-center space-x-2">
          <button
            title="Show destination"
            onClick={() => setFocus({ type: "dropoff" })}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F3F4F0] hover:bg-gray-200 transition-colors"
          >
            <Current width={18} />
          </button>
          <button
            title="Show rider"
            onClick={() => {
              const hasRider =
                order.courier?.latest_location?.coordinates?.length === 2;
              if (!hasRider) {
                setFocus({ type: "pickup" });
                setErrorMessage(
                  "Rider location not available — focusing pickup as fallback"
                );
                setTimeout(() => setErrorMessage(null), 3000);
                return;
              }
              setFocus({ type: "rider" });
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F3F4F0] hover:bg-gray-200 transition-colors"
          >
            <Rider width={18} />
          </button>
          <button
            title={expanded ? "Collapse details" : "Expand details"}
            onClick={() => setExpanded((v) => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F3F4F0] hover:bg-gray-200 transition-colors"
          >
            <span
              className={`inline-block transform transition-transform ${
                expanded ? "rotate-180" : "rotate-0"
              }`}
            >
              <Expand width={18} />
            </span>
          </button>
        </div>
      </div>

      {/* Bottom sheet — always peeking, expands on demand */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-20 bg-white rounded-t-3xl shadow-2xl transition-all duration-300 ease-in-out ${
          expanded ? "h-[80vh]" : "h-[45vh]"
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Scrollable content */}
        <div className="h-full overflow-y-auto custom-scrollbar px-5 pb-8">
          <TrackingDetails
            order={order}
            formatDateTime={formatDateTime}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>

      {/* Toast message */}
      {errorMessage && (
        <div className="fixed top-16 left-4 right-4 z-40">
          <div className="bg-black/80 text-white text-sm px-4 py-2 rounded-xl shadow text-center">
            {errorMessage}
          </div>
        </div>
      )}
    </div>
  );
}

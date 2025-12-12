"use client";

import { useState } from "react";
import { Order } from "@/types/order";

import Rider from "@/icons/rider";
import Current from "@/icons/location";
import Expand from "@/icons/expand";
import TrackingDetails from "./TrackingDetails";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Mobile Header */}
      <div className="fixed top-4 left-4 right-4 z-30 flex items-center justify-between bg-white shadow-2xl rounded-full p-3">
        <h1 className="text-2xl font-bold text-yellow-500">VIGO</h1>
        <div className="flex space-x-2">
          <button
            title="Show destination"
            onClick={() => setFocus({ type: "dropoff" })}
            className="p-1 rounded-full bg-[#F9FAF7] hover:bg-gray-100"
          >
            <Current width={24} />
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
            className="p-1 rounded-full bg-[#F9FAF7] hover:bg-gray-100"
          >
            <Rider width={24} />
          </button>
          <Sheet open={isOpen} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                title="Toggle details"
                className="p-1 rounded-full bg-[#F9FAF7] hover:bg-gray-100"
              >
                <span
                  className={`inline-block transform transition-transform ${
                    isOpen ? "rotate-0" : "-rotate-90"
                  }`}
                >
                  <Expand width={24} />
                </span>
              </button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="h-auto max-h-[80vh] rounded-t-3xl flex flex-col"
            >
              <SheetHeader>
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-4 mb-4"></div>
              </SheetHeader>
              <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                <TrackingDetails
                  order={order}
                  formatDateTime={formatDateTime}
                  formatCurrency={formatCurrency}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Order } from "@/types/order";
import { useParams } from "next/navigation";
import axios from "axios";
import ErrorBanner from "@/components/ErrorBanner";

import dynamic from "next/dynamic";
import Rider from "@/icons/rider";
import Current from "@/icons/location";
import Expand from "@/icons/expand";
import MobileTrackingPanel from "@/components/MobileTrackingPanel";
import TrackingDetails from "@/components/TrackingDetails";

const Map = dynamic(() => import("../../../../components/GoogleMap"), {
  loading: () => <p className="text-white text-center">A map is loading...</p>,
  ssr: false,
});

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date
    .toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", "");
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency || "NGN",
  }).format(amount);
};

export default function TrackingPage() {
  const params = useParams();
  const trackingCode = params.trackingCode as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [focus, setFocus] = useState<null | {
    type: "pickup" | "dropoff" | "rider";
  }>(null);

  useEffect(() => {
    if (!trackingCode) return;

    const getOrderDetails = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const response = await axios.get(
          `https://api-staging.vigoride.net/v1/orders/tracking/${trackingCode}`
        );
        setOrder(response.data.data);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
        // Provide a clearer message depending on the error
        if (axios.isAxiosError(err)) {
          const status = err.response?.status;
          if (status === 404) {
            setErrorMessage(
              `No order found for tracking code '${trackingCode}'.`
            );
          } else {
            setErrorMessage(
              "Failed to load order. Please check your network connection and try again."
            );
          }
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    getOrderDetails();
  }, [trackingCode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading order details...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading order details...
      </div>
    );
  }

  if (error || !order) {
    return (
      <ErrorBanner
        title={errorMessage ? "Issue loading order" : "Tracking ID not found"}
        message={
          errorMessage ||
          `We couldn't find an order for the tracking code '${trackingCode}'. Please verify the code or try again.`
        }
        onRetry={() => {
          setError(false);
          setErrorMessage(null);
          setLoading(true);
          // trigger refetch by calling the fetch again
          (async () => {
            try {
              const response = await axios.get(
                `https://api-staging.vigoride.net/v1/orders/tracking/${trackingCode}`
              );
              setOrder(response.data.data);
            } catch (err) {
              console.error("Retry failed:", err);
              if (axios.isAxiosError(err)) {
                const status = err.response?.status;
                if (status === 404) {
                  setErrorMessage(
                    `No order found for tracking code '${trackingCode}'.`
                  );
                } else {
                  setErrorMessage(
                    "Failed to load order. Please check your network connection and try again."
                  );
                }
              } else {
                setErrorMessage("An unexpected error occurred.");
              }
              setError(true);
            } finally {
              setLoading(false);
            }
          })();
        }}
      />
    );
  }

  const hasCoordinates =
    order.pickup_location?.coordinates?.length === 2 &&
    order.drop_off_location?.coordinates?.length === 2;

  return (
    <div className="relative h-screen bg-gray-900 font-sans">
      {/* Desktop Side Panel */}
      <aside
        className={`hidden md:flex fixed left-4 top-4 bottom-4 bg-white shadow-2xl rounded-3xl overflow-hidden z-20 flex-row transition-all duration-300 ${
          collapsed ? "w-24 p-2" : "w-full max-w-lg p-6"
        }`}
      >
        <div
          className={`flex flex-col items-center justify-between bg-[#F9FAF7] transition-all duration-300 ${
            collapsed ? "w-20 p-2 border-r-0" : "p-3 border-r-2 border-gray-400"
          }`}
        >
          <h1 className="text-3xl font-bold text-yellow-500">VIGO</h1>
          <div className="space-y-4">
            <button
              title="Show destination"
              onClick={() => setFocus({ type: "dropoff" })}
              className="p-1 rounded hover:bg-white/30"
            >
              <Current width={collapsed ? 32 : 64} />
            </button>

            <button
              title="Show rider"
              onClick={() => {
                const hasRider =
                  order.courier?.latest_location?.coordinates?.length === 2;
                if (!hasRider) {
                  // fallback: focus pickup so user still sees something useful
                  setFocus({ type: "pickup" });
                  setErrorMessage(
                    "Rider location not available — focusing pickup as fallback"
                  );
                  setTimeout(() => setErrorMessage(null), 3000);
                  return;
                }
                setFocus({ type: "rider" });
              }}
              className="p-1 rounded hover:bg-white/30"
            >
              <Rider width={collapsed ? 32 : 64} />
            </button>

            <button
              title={collapsed ? "Expand details" : "Collapse details"}
              onClick={() => setCollapsed((s) => !s)}
              className="p-1 rounded hover:bg-white/30"
            >
              <span
                className={`inline-block transform transition-transform ${
                  collapsed ? "-rotate-90" : "rotate-0"
                }`}
              >
                <Expand width={collapsed ? 28 : 60} />
              </span>
            </button>
          </div>
        </div>

        {/* Details column */}
        <div
          className={
            collapsed
              ? "hidden"
              : "ml-4 mt-4 space-y-6 overflow-y-auto custom-scrollbar"
          }
        >
          <TrackingDetails
            order={order}
            formatDateTime={formatDateTime}
            formatCurrency={formatCurrency}
          />
        </div>
      </aside>

      {/* Mobile Tracking Panel */}
      <MobileTrackingPanel
        order={order}
        setFocus={setFocus}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        formatDateTime={formatDateTime}
        formatCurrency={formatCurrency}
      />

      {/* Map fills the background */}
      <div className="absolute inset-0 z-0">
        {hasCoordinates ? (
          <Map
            pickup={{
              lat: order.pickup_location.coordinates[1],
              lng: order.pickup_location.coordinates[0],
            }}
            dropoff={{
              lat: order.drop_off_location.coordinates[1],
              lng: order.drop_off_location.coordinates[0],
            }}
            rider={
              order.courier?.latest_location?.coordinates?.length === 2
                ? {
                    lat: order.courier.latest_location.coordinates[1],
                    lng: order.courier.latest_location.coordinates[0],
                  }
                : null
            }
            focus={focus}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-slate-800 text-white">
            Map data not available.
          </div>
        )}
      </div>
      {/* Temporary toast for messages like missing rider location */}
      {errorMessage && (
        <div className="fixed top-6 right-6 z-30">
          <div className="bg-black/80 text-white px-4 py-2 rounded-lg shadow">
            {errorMessage}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Order } from "@/types/order";
import { useParams } from "next/navigation";
import axios from "axios";
import ErrorBanner from "@/components/ErrorBanner";
import { Package } from "lucide-react";
import dynamic from "next/dynamic";
import Rider from "@/icons/rider";
import Current from "@/icons/location";
import Expand from "@/icons/expand";
import MobileTrackingPanel from "@/components/MobileTrackingPanel";

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
  const [focus, setFocus] = useState<null | { type: "pickup" | "dropoff" | "rider" }>(null);

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
          errorMessage || `We couldn't find an order for the tracking code '${trackingCode}'. Please verify the code or try again.`
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
                  setErrorMessage("Rider location not available — focusing pickup as fallback");
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
        <div className={collapsed ? "hidden" : "ml-4 mt-4 space-y-6 overflow-y-auto custom-scrollbar"}>
          {/* User's Details */}
          <section className=" p-2 rounded-3xl border-2 border-[#F6F6F6]">
            <h2 className="text-lg font-bold text-black mb-2">
              User's Details
            </h2>
            <div className="grid grid-cols-2 gap-x-8">
              <div>
                <p className="text-xs text-gray-400 mb-1">Name</p>
                <p className="font-semibold text-sm text-black">
                  {order.user.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Date&Time</p>
                <p className="font-semibold text-sm text-black">
                  {formatDateTime(order.created_at)}
                </p>
              </div>
            </div>
          </section>

          {/* Trip Details */}
          <section className=" p-2 rounded-3xl border-2 border-[#F6F6F6]">
            <h2 className="text-lg font-bold text-black mb-2">Trip Details</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Pick up</p>
                <p className="font-semibold text-sm text-black">
                  {order.pickup_location_title}
                </p>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Distance</p>
                  <p className="font-semibold text-sm text-black">
                    {order.estimated_distance_km.toFixed(0)}KM
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Destination</p>
                <p className="font-semibold text-sm text-black">
                  {order.drop_off_location_title}
                </p>
              </div>
            </div>
          </section>

          {/* Driver's Details */}
          <section className=" p-2 rounded-3xl border-2 border-[#F6F6F6]">
            <h2 className="text-lg font-bold text-black mb-2">
              Driver's Details
            </h2>
            <div className="space-y-4">
              <p className="text-xs text-gray-400 mb-1">
                Arriving in {order.estimated_duration_minutes}min
              </p>
              <div className="flex space-x-1 mb-4">
                <div className="h-1 w-1/3 bg-yellow-500 rounded-full"></div>
                <div className="h-1 w-1/3 bg-yellow-500 rounded-full"></div>
                <div className="h-1 w-1/3 bg-gray-300 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-3">
                {/* Driver Image Placeholder */}
                <div className="relative h-10 w-10 rounded-full bg-gray-300 flex-shrink-0">
                  {order.courier?.image && (
                    <img
                      src={order.courier.image}
                      alt="Driver"
                      className="h-full w-full rounded-full object-cover"
                    />
                  )}
                  <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.565-1.839-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm text-black">
                    {order.courier?.name} • Top Rated
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.courier_vehicle?.plate_number} •{" "}
                    {order.courier_vehicle?.type},{" "}
                    {order.courier_vehicle?.vehicle_color}.
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <a
                  href={`sms:${order.courier?.phone_number?.code}${order.courier?.phone_number?.number}`}
                  className="flex items-center justify-center w-1/2 py-2 px-4 border border-gray-300 rounded-lg text-black font-medium hover:bg-gray-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H2a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Message
                </a>
                <a
                  href={`tel:${order.courier?.phone_number?.code}${order.courier?.phone_number?.number}`}
                  className="flex items-center justify-center w-1/2 py-2 px-4 border border-gray-300 rounded-lg text-black font-medium hover:bg-gray-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Call
                </a>
              </div>
            </div>
          </section>

          {/* Order Summary */}
          <section className=" p-2 rounded-3xl border-2 border-[#F6F6F6]">
            <h2 className="text-lg font-bold text-black mb-2">Order Summary</h2>
            <div className="grid grid-cols-2 gap-x-8 mb-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Order ID</p>
                <p className="font-semibold text-sm text-black">
                  {order.tracking_code}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <p className="font-semibold text-sm text-yellow-600 capitalize">
                  {order.status.replace(/_/g, " ")}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-semibold text-black">
                {order.package_type}
              </span>
            </div>
          </section>

          {/* Payment Details */}
          <section className=" p-2 rounded-3xl border-2 border-[#F6F6F6]">
            <h2 className="text-lg font-bold text-black mb-2">
              Payment Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm text-black">Cash</p>
                <p className="text-sm font-semibold text-black">
                  {formatCurrency(order.amount, order.currency)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-black">Discount 10%</p>
                <p className="text-sm font-semibold text-black">
                  -{formatCurrency(order.amount * 0.1, order.currency)}
                </p>
              </div>
              <div className="flex justify-between items-center font-bold text-base pt-3 border-t border-gray-200">
                <p className="text-black">Total</p>
                <p className="text-black">
                  {formatCurrency(order.amount * 0.9, order.currency)}
                </p>
              </div>
            </div>
          </section>
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
          <div className="bg-black/80 text-white px-4 py-2 rounded-lg shadow">{errorMessage}</div>
        </div>
      )}
    </div>
  );
}

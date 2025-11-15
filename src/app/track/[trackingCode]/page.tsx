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
    <div className="flex h-screen bg-gray-900 font-sans">
      {/* Left Side Panel */}
      <div className="w-full max-w-md bg-white shadow-2xl m-4 rounded-3xl pl-0 pt-0 p-8 pb-0 flex flex-row  overflow-y-auto z-10 ">
        <div className="border-r-2 border-gray-400 flex flex-col items-center justify-between mt4 p-3 bg-[#F9FAF7] ">
          <h1 className="text-3xl font-bold text-yellow-500">VIGO</h1>
          <div className=" space-y-5">
            <Current width={50} />
            <Rider width={50} />
            <Expand width={50} />
          </div>
        </div>

        <div className="ml-4 mt-4 space-y-6">
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
      </div>

      {/* Right Side Map */}
      {/* <div className="absolute inset-0 z-0">
        {hasCoordinates ? (
          <Map
            pickup={{
              lng: order.pickup_location.coordinates[0],
              lat: order.pickup_location.coordinates[1],
            }}
            dropoff={{
              lng: order.drop_off_location.coordinates[0],
              lat: order.drop_off_location.coordinates[1],
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-slate-800 text-white">
            Map data not available.
          </div>
        )}
      </div> */}
    </div>
  );
}

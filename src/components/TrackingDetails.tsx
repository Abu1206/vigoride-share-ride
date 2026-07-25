"use client";

import { Order } from "@/types/order";

interface TrackingDetailsProps {
  order: Order;
  formatDateTime: (dateString: string) => string;
  formatCurrency: (amount: number, currency: string) => string;
}

export default function TrackingDetails({
  order,
  formatDateTime,
  formatCurrency,
}: TrackingDetailsProps) {
  const hasCourier = !!order.courier;

  return (
    <div className="space-y-0">
      {/* User's Details */}
      <section className="py-4">
        <h2 className="text-base font-bold text-black mb-3">
          User&apos;s Details
        </h2>
        <div className="grid grid-cols-2 gap-x-6">
          <div>
            <p className="text-xs text-gray-400 mb-1">Name</p>
            <p className="font-semibold text-sm text-black">{order.user.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Date&amp;Time</p>
            <p className="font-semibold text-sm text-black">
              {formatDateTime(order.created_at)}
            </p>
          </div>
        </div>
      </section>

      <div className="h-px bg-[#F0F0F0]" />

      {/* Trip Details */}
      <section className="py-4">
        <h2 className="text-base font-bold text-black mb-3">Trip Details</h2>
        <div className="grid grid-cols-2 gap-x-6 mb-3">
          <div>
            <p className="text-xs text-gray-400 mb-1">Pick up</p>
            <p className="font-semibold text-sm text-black">
              {order.pickup_location_title}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Destination</p>
            <p className="font-semibold text-sm text-black">
              {order.drop_off_location_title}
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Distance</p>
          <p className="font-semibold text-sm text-black">
            {order.estimated_distance_km.toFixed(0)}KM
          </p>
        </div>
      </section>

      <div className="h-px bg-[#F0F0F0]" />

      {/* Driver's Details */}
      {hasCourier && (
        <>
          <section className="py-4">
            <h2 className="text-base font-bold text-black mb-3">
              Driver&apos;s Details
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              Arriving in {order.estimated_duration_minutes}min
            </p>
            {/* Progress bar */}
            <div className="flex space-x-1 mb-4">
              <div className="h-1 w-1/3 bg-yellow-500 rounded-full" />
              <div className="h-1 w-1/3 bg-yellow-500 rounded-full" />
              <div className="h-1 w-1/3 bg-gray-200 rounded-full" />
            </div>

            {/* Driver card */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                {order.courier?.image && (
                  // eslint-disable-next-line @next/next/no-img-element
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
                <p className="font-semibold text-sm text-yellow-500">
                  {order.courier?.name}{" "}
                  <span className="text-black">• Top Rated</span>
                </p>
                <p className="text-xs text-gray-500">
                  {order.courier_vehicle?.plate_number} •{" "}
                  {order.courier_vehicle?.type},{" "}
                  {order.courier_vehicle?.vehicle_color}.
                </p>
              </div>
            </div>

            {/* Send a message button */}
            <a
              href={`sms:${order.courier?.phone_number?.code}${order.courier?.phone_number?.number}`}
              className="flex items-center space-x-2 text-sm text-black font-medium hover:opacity-70 transition-opacity"
            >
              {/* Phone/message icon matching the design */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6.29 6.29l1.62-1.62a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>Send a message</span>
            </a>
          </section>

          <div className="h-px bg-[#F0F0F0]" />
        </>
      )}

      {/* Order Summary */}
      <section className="py-4">
        <h2 className="text-base font-bold text-black mb-3">Order Summary</h2>
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-xs text-gray-400 mb-1">Order ID</p>
            <p className="font-semibold text-sm text-black">
              {order.tracking_code}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-1">Status</p>
            <p className="font-semibold text-sm text-orange-500 capitalize">
              {order.status
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </p>
          </div>
        </div>
        {/* Package type with emoji */}
        <div className="flex items-center space-x-2">
          <span className="text-xl">📦</span>
          <span className="text-sm font-semibold text-black underline">
            {order.package_type}
          </span>
        </div>
      </section>

      <div className="h-px bg-[#F0F0F0]" />

      {/* Payment Details */}
      <section className="py-4">
        <h2 className="text-base font-bold text-black mb-3">Payment Details</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Cash</p>
            <p className="text-sm text-black">
              {formatCurrency(order.amount, order.currency)}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Discount 10%</p>
            <p className="text-sm text-black">
              -{formatCurrency(order.amount * 0.1, order.currency)}
            </p>
          </div>
          <div className="flex justify-between items-center font-bold text-sm pt-3 border-t border-gray-100">
            <p className="text-black">Total</p>
            <p className="text-black">
              {formatCurrency(order.amount * 0.9, order.currency)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

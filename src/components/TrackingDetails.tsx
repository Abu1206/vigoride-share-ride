import { Order } from "@/types/order";
import { Package } from "lucide-react";

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
  return (
    <>
      {/* User's Details */}
      <section className="p-2 rounded-3xl border-2 border-[#F6F6F6]">
        <h2 className="text-lg font-bold text-black mb-2">User's Details</h2>
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
      <section className="p-2 rounded-3xl border-2 border-[#F6F6F6]">
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
      <section className="p-2 rounded-3xl border-2 border-[#F6F6F6]">
        <h2 className="text-lg font-bold text-black mb-2">Driver's Details</h2>
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
      <section className="p-2 rounded-3xl border-2 border-[#F6F6F6]">
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
      <section className="p-2 rounded-3xl border-2 border-[#F6F6F6]">
        <h2 className="text-lg font-bold text-black mb-2">Payment Details</h2>
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
    </>
  );
}

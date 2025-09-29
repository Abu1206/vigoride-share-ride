export interface Order {
  id: string;
  status: string;
  order_type: string;
  package_type: string;
  tracking_code: string;
  estimated_distance_km: number;
  estimated_duration_minutes: number;
  vehicle_type: string;
  note: string;
  pickup_contact_name: string;
  pickup_contact_phone_number: PhoneNumber;
  pickup_location: Location;
  pickup_location_title: string;
  drop_off_contact_name: string;
  drop_off_contact_phone_number: PhoneNumber;
  drop_off_location: Location;
  drop_off_location_title: string;
  currency: string;
  amount: number;
  rating_of_courier: number;
  rating_of_courier_comment: string;
  rating_of_user: number;
  rating_of_user_comment: string;
  timeline: TimelineEvent[];
  user: User;
  courier: User;
  courier_vehicle: Vehicle;
  created_at: string;
  updated_at: string;
}

export interface PhoneNumber {
  code: string;
  number: string;
}

export interface Location {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface TimelineEvent {
  slug: string;
  is_done: boolean;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  email_verified: boolean;
  phone_number: PhoneNumber;
  phone_number_verified: boolean;
  image: string;
  date_of_birth: string;
  role: string;
  expo_push_token: string[];
  courier_status: string;
  account_disabled: boolean;
  provider: string;
  provider_id: string;
  referral_code: string;
  referral_code_used: string;
  latest_location: Location;
  vehicles: Vehicle[];
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  type: string;
  status: string;
  brand: string;
  vehicle_color: string;
  plate_number: string;
  photos: Photo[];
  certificate_of_registration: string[];
  owner: string;
  created_at: string;
  updated_at: string;
}

export interface Photo {
  id: string;
  original_name: string;
  mime_type: string;
  size: number;
  aws_s3_key: string;
  aws_s3_bucket: string;
  aws_signed_url: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

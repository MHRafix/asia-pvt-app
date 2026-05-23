/**
 * Travel Agency Type Definitions
 * Centralized types for consistency across the application
 */

export interface VisaCountry {
  _id?: string;
  slug: string;
  name: string;
  flag: string;
  processing: string;
  type: string;
  description: string;
  requirements: string[];
  documents: string[];
  fees: { type: string; amount: string }[];
  tips: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPost {
  _id?: string;
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  authorAvatar: string;
  date: string;
  category: string;
  readTime: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TravelPackage {
  _id?: string;
  id: string;
  title: string;
  location: string;
  image: string;
  price: number;
  duration: string;
  groupSize: string;
  rating: number;
  reviews: number;
  description: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  itinerary: { day: number; title: string; description: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  _id?: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  longDescription: string;
  features: string[];
  process: { step: number; title: string; description: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Destination {
  _id: string;
  name: string;
  country: string;
  description: string;
  images: string[];
  highlights: string[];
  bestTimeToVisit: string;
  averageTemperature: string;
  timezone: string;
  currency: string;
  language: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  bio?: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  user: string | User;
  travelPackage: string | TravelPackage;
  destination: string | Destination;
  numberOfTravelers: number;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  bookingDate: string;
  departureDate: string;
  returnDate: string;
  specialRequests?: string;
  paymentStatus: 'Pending' | 'Completed' | 'Failed';
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  user: string | User;
  destination?: string | Destination;
  travelPackage?: string | TravelPackage;
  rating: number;
  title: string;
  content: string;
  images: string[];
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  skip: number;
  limit: number;
  pages: number;
}

export interface ApiResponse<T = null> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Dashboard Analytics Types
export interface DashboardStats {
  totalPackages: number;
  totalServices: number;
  totalBlogs: number;
  totalVisaCountries: number;
  totalAppointments: number;
  totalContacts: number;
  pendingAppointments: number;
  newMessages: number;
}

export interface ChartData {
  name: string;
  value: number;
}

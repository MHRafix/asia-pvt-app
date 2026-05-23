import { Headphones, Briefcase, Plane, CreditCard, FileText, Calendar } from "lucide-react";

export interface Service {
  slug: string;
  icon: typeof Headphones;
  title: string;
  description: string;
  duration: string;
  longDescription: string;
  features: string[];
  process: { step: number; title: string; description: string }[];
}

export const services: Service[] = [
  {
    slug: "travel-consultation",
    icon: Headphones,
    title: "Travel Consultation",
    description: "One-on-one session with our travel experts",
    duration: "30 min",
    longDescription:
      "Get personalized travel advice from our experienced consultants who have explored destinations worldwide. We help you plan the perfect trip based on your preferences, budget, and travel style.",
    features: [
      "Personalized destination recommendations",
      "Budget optimization strategies",
      "Best travel season advice",
      "Safety and health travel tips",
      "Customized itinerary suggestions",
    ],
    process: [
      { step: 1, title: "Book Appointment", description: "Choose your preferred date and time slot." },
      { step: 2, title: "Share Preferences", description: "Tell us about your dream vacation and budget." },
      { step: 3, title: "Get Expert Advice", description: "Receive personalized recommendations from our expert." },
      { step: 4, title: "Plan Your Trip", description: "We create a custom itinerary just for you." },
    ],
  },
  {
    slug: "corporate-travel",
    icon: Briefcase,
    title: "Corporate Travel",
    description: "Business travel planning and management",
    duration: "45 min",
    longDescription:
      "Streamline your company's travel with our comprehensive corporate travel management service. We handle everything from booking to expense reporting.",
    features: [
      "Negotiated corporate rates",
      "Travel policy compliance",
      "24/7 emergency support",
      "Expense management integration",
      "Group booking coordination",
    ],
    process: [
      { step: 1, title: "Initial Consultation", description: "Understand your company's travel needs and policies." },
      { step: 2, title: "Custom Solutions", description: "Design a tailored corporate travel program." },
      { step: 3, title: "Implementation", description: "Set up booking systems and traveler profiles." },
      { step: 4, title: "Ongoing Support", description: "Continuous management and optimization." },
    ],
  },
  {
    slug: "flight-booking",
    icon: Plane,
    title: "Flight Booking",
    description: "Find the best deals on flights",
    duration: "20 min",
    longDescription:
      "Our flight specialists search across hundreds of airlines to find you the best deals. Whether economy or first class, domestic or international.",
    features: [
      "Best fare guarantee",
      "Multi-city routing options",
      "Flexible date search",
      "Seat selection assistance",
      "Loyalty program optimization",
    ],
    process: [
      { step: 1, title: "Share Requirements", description: "Tell us your dates, destinations, and preferences." },
      { step: 2, title: "Compare Options", description: "We present the best flight options for you." },
      { step: 3, title: "Book & Confirm", description: "Secure your booking with instant confirmation." },
      { step: 4, title: "Pre-Flight Support", description: "Check-in reminders and travel updates." },
    ],
  },
  {
    slug: "travel-insurance",
    icon: CreditCard,
    title: "Travel Insurance",
    description: "Comprehensive coverage for your trip",
    duration: "15 min",
    longDescription:
      "Protect your investment and travel with peace of mind. We offer comprehensive insurance plans covering medical emergencies, trip cancellations, and lost luggage.",
    features: [
      "Medical emergency coverage",
      "Trip cancellation protection",
      "Lost baggage reimbursement",
      "Flight delay compensation",
      "24/7 global assistance",
    ],
    process: [
      { step: 1, title: "Assess Needs", description: "We evaluate your trip type and coverage needs." },
      { step: 2, title: "Compare Plans", description: "Review multiple insurance options and pricing." },
      { step: 3, title: "Purchase Coverage", description: "Secure your policy with instant documentation." },
      { step: 4, title: "Travel Protected", description: "24/7 support throughout your journey." },
    ],
  },
  {
    slug: "visa-consultation",
    icon: FileText,
    title: "Visa Consultation",
    description: "Document review and application guidance",
    duration: "30 min",
    longDescription:
      "Navigate complex visa processes with expert guidance. Our visa specialists handle documentation, applications, and follow-ups to ensure your visa is approved.",
    features: [
      "Document checklist preparation",
      "Application form assistance",
      "Interview preparation",
      "Status tracking",
      "Express processing available",
    ],
    process: [
      { step: 1, title: "Eligibility Check", description: "Verify visa requirements for your destination." },
      { step: 2, title: "Document Review", description: "Our experts review and prepare your documents." },
      { step: 3, title: "Application Submission", description: "We submit your application with proper follow-up." },
      { step: 4, title: "Visa Received", description: "Collect your approved visa and travel with confidence." },
    ],
  },
  {
    slug: "itinerary-planning",
    icon: Calendar,
    title: "Itinerary Planning",
    description: "Custom trip planning and scheduling",
    duration: "45 min",
    longDescription:
      "Let our travel designers create a day-by-day itinerary tailored to your interests, pace, and budget. Every moment of your trip is thoughtfully planned.",
    features: [
      "Day-by-day detailed planning",
      "Local hidden gems included",
      "Restaurant reservations",
      "Activity pre-booking",
      "Flexible modification support",
    ],
    process: [
      { step: 1, title: "Discovery Call", description: "Share your travel style, interests, and must-sees." },
      { step: 2, title: "Draft Itinerary", description: "Receive a detailed day-by-day plan for review." },
      { step: 3, title: "Refine & Finalize", description: "Make adjustments until it's perfect." },
      { step: 4, title: "Travel Ready", description: "Get your final itinerary with all confirmations." },
    ],
  },
];

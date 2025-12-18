import React from "react";
import {
  Calendar,
  Zap,
  Users,
  Lock,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { FeatureCard } from "./FeatureCard";

const features = [
  {
    icon: Calendar,
    title: "Event Creation & Scheduling",
    description:
      "Create stunning events with detailed scheduling, seamless calendar integration, and automated reminders for your attendees.",
  },
  {
    icon: Zap,
    title: "Online Ticket Booking",
    description:
      "Sell tickets instantly with dynamic pricing, multiple payment options, and real-time inventory management.",
  },
  {
    icon: Users,
    title: "Guest Management",
    description:
      "Effortlessly manage guest lists, track RSVPs, send personalized communications, and handle check-ins.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description:
      "Bank-level security with encrypted transactions, multiple payment gateways, and fraud protection.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Real-time insights into ticket sales, attendee demographics, revenue tracking, and performance metrics.",
  },
  {
    icon: Sparkles,
    title: "Smart Promotion",
    description:
      "Built-in marketing tools including email campaigns, social media integration, and audience targeting.",
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50 border-y border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              For Every Event
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Everything you need to create, manage, and promote successful events
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

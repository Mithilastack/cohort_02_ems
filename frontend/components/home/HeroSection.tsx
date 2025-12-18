import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onCreateEvent?: () => void;
  onExploreEvents?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onCreateEvent,
  onExploreEvents,
}) => {
  const stats = [
    { value: "50K+", label: "Active Events", color: "text-purple-400" },
    { value: "2.5M+", label: "Attendees", color: "text-blue-400" },
    { value: "$500M+", label: "Revenue Processed", color: "text-amber-400" },
  ];

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl -translate-x-1/2"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-block mb-8 px-4 py-2 bg-purple-600/20 border border-purple-500/50 rounded-full">
            <span className="text-sm font-semibold text-purple-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Trusted by 50,000+ Event Organizers
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Plan. Manage.{" "}
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-amber-400 bg-clip-text text-transparent">
              Celebrate
            </span>
            <br />
            <span className="text-slate-400">All in One Platform</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-8">
            The ultimate event management platform for corporate events, weddings, concerts,
            conferences, and college fests. Create events, sell tickets, manage guests, and
            track analytics—all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={onCreateEvent}
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition flex items-center gap-2"
            >
              <span>Create Event</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
            <button
              onClick={onExploreEvents}
              className="px-8 py-4 border-2 border-slate-600 text-white font-bold rounded-lg hover:bg-slate-900 transition"
            >
              Explore Events
            </button>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className={`text-3xl md:text-4xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

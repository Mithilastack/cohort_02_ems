import React from "react";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  onExploreEvents?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreEvents,
}) => {
  const stats = [
    { value: "50K+", label: "Active Events", color: "text-purple-400" },
    { value: "2.5M+", label: "Attendees", color: "text-blue-400" },
    { value: "$500M+", label: "Revenue Processed", color: "text-amber-400" },
  ];

  return (
    <div className="min-h-screen w-full flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden pt-32 pb-20">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      {/* Grid Pattern */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none opacity-20",
          "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]",
        )}
      />

      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full">

        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-block px-4 py-2 bg-purple-600/10 border border-purple-500/20 rounded-full backdrop-blur-sm">
            <span className="text-sm font-semibold text-purple-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Trusted by 50,000+ Event Organizers
            </span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 mb-8 leading-tight tracking-tight">
          Plan. Manage.{" "}
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-amber-400 bg-clip-text text-transparent">
            Celebrate
          </span>
        </h1>

        <p className="mt-4 font-normal text-base md:text-lg text-neutral-300 max-w-2xl text-center mx-auto mb-12 leading-relaxed">
          The ultimate event management platform for corporate events, weddings, concerts,
          conferences, and college fests. Create events, sell tickets, manage guests, and
          track analytics—all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            href="/events"
            onClick={onExploreEvents}
            className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] z-20"
          >
            Explore Events
          </Link>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto border-t border-neutral-800 pt-10">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group hover:bg-white/5 p-4 rounded-xl transition-colors">
              <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-neutral-500 text-sm font-medium uppercase tracking-wider group-hover:text-neutral-300 transition-colors">{stat.label}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

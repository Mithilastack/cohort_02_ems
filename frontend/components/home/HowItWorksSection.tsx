import React from "react";

interface Step {
  number: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Create Event",
    description: "Set up your event details, date, venue, and ticket types in minutes",
  },
  {
    number: "02",
    title: "Publish & Promote",
    description: "Go live and reach your audience through our built-in promotion tools",
  },
  {
    number: "03",
    title: "Manage Bookings",
    description: "Handle registrations, payments, and communications effortlessly",
  },
  {
    number: "04",
    title: "Track Analytics",
    description: "Monitor sales, attendance, and gain valuable insights about your event",
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get Started in <span className="text-amber-400">4 Simple Steps</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            From event creation to analytics, our platform makes it effortless
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[50%] w-[100%] h-0.5 bg-gradient-to-r from-purple-600 to-blue-600"></div>
              )}

              {/* Step Card */}
              <div className="relative z-10 bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-xl border border-slate-700 hover:border-purple-500/50 transition">
                <div className="text-4xl font-black text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

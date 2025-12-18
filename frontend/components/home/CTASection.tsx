import React from "react";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  onGetStarted?: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onGetStarted }) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-5xl md:text-6xl font-black mb-6">
          Ready to Host Your <br />
          <span className="text-transparent bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text">
            Next Successful Event?
          </span>
        </h2>
        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          Join thousands of event organizers who trust EventMS to manage their events
        </p>
        <button
          onClick={onGetStarted}
          className="group px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-lg rounded-lg hover:shadow-2xl hover:shadow-amber-500/50 transition flex items-center justify-center gap-2 mx-auto"
        >
          <span>Get Started Free</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition" />
        </button>
        <p className="text-slate-500 text-sm mt-6">
          No credit card required. Start your free trial today.
        </p>
      </div>
    </section>
  );
};

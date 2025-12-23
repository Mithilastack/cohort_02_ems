
import React from 'react';

// import VisualStack from './VisualStack';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen pt-32 pb-20 px-6 md:px-12 lg:px-24 overflow-hidden flex flex-col justify-center bg-slate-950">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(79,70,229,0.15),transparent_50%)]"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.1),transparent_50%)]"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto w-full relative z-10">

        {/* Left Side: Content */}
        <div className="flex flex-col space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-800 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
              The World's #1 Event Platform
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
              Discover, Book & <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Experience
              </span> Amazing Events
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-medium max-w-xl leading-relaxed">
              Book concerts, workshops, conferences, and live experiences in just a few clicks. Your next unforgettable moment is waiting.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 bg-white text-slate-950 font-bold rounded-2xl hover:bg-indigo-50 transition-all shadow-xl shadow-white/5 flex items-center gap-2 group">
              Book Events Now
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl border border-slate-800 hover:border-indigo-500 hover:text-indigo-400 transition-all">
              Explore Upcoming
            </button>
          </div>


          {/* Social Proof / Trust */}
          <div className="flex items-center gap-8 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-950 bg-slate-800 overflow-hidden ring-1 ring-slate-800">
                  <img src={`https://picsum.photos/seed/face_dark_${i}/100/100`} alt="User" />
                </div>
              ))}
            </div>
            <div>
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map(i => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm font-bold text-slate-300 mt-1">4.9/5 from 2,000+ reviews</p>
            </div>
          </div>
        </div>

        {/* Right Side: Visuals */}
        {/* <VisualStack /> */}
      </div>

      {/* Decorative background elements */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-900/20 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px] -z-10"></div>
    </section>
  );
};

export default Hero;

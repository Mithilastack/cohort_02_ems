'use client'

import React, { useState } from 'react'
import { ArrowRight, Star, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] pt-32 pb-20 px-6 md:px-12 lg:px-24 overflow-hidden flex flex-col justify-center bg-slate-950">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-teal-600/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[50vw] h-[50vw] bg-gradient-to-tr from-teal-600/10 via-indigo-600/10 to-purple-600/10 rounded-full blur-[80px]"></div>

        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-purple-500 rounded-full blur-[2px] animate-float-delay-1 opacity-70"></div>
        <div className="absolute top-3/4 right-1/4 w-4 h-4 bg-teal-500 rounded-full blur-[2px] animate-float-delay-2 opacity-70"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-500 rounded-full blur-[1px] animate-float opacity-70"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto w-full relative z-10">

        {/* Left Side: Content */}
        <div className="flex flex-col space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <Badge variant="outline" className="w-fit px-4 py-1.5 border-purple-500/30 bg-purple-500/10 text-purple-300 font-semibold rounded-full shadow-[0_0_10px_rgba(168,85,247,0.2)]">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse shadow-[0_0_8px_rgba(192,132,252,0.8)]"></span>
              The World's #1 Event Platform
            </Badge>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight font-display">
              Book <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-teal-300">Unforgettable</span> <br />
              Events, Instantly
            </h1>

            <p className="text-lg text-slate-400 font-medium max-w-xl leading-relaxed">
              Find concerts, workshops, weddings, parties, and business events — all in one place.
            </p>
          </div>


          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/events">
              <Button size="lg" className="rounded-2xl h-14 px-8 bg-white text-slate-950 hover:bg-slate-100 shadow-[0_0_20px_rgba(255,255,255,0.1)] text-base font-bold">
                Explore Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

          </div>

          {/* Trust Indicators */}
          <div className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 overflow-hidden ring-1 ring-slate-800 shadow-lg">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-slate-950 bg-purple-900/50 flex items-center justify-center text-xs font-bold text-purple-300 shadow-lg backdrop-blur-sm">
                10k+
              </div>
            </div>
            <div>
              <div className="flex text-yellow-400 mb-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-current drop-shadow-[0_0_2px_rgba(250,204,21,0.5)]" />
                ))}
              </div>
              <p className="text-sm font-semibold text-slate-400">
                4.9/5 from <span className="text-purple-400">Happy Users</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Visuals */}
        <div className="relative h-[600px] w-full hidden lg:block"> 
          {/* Main Visual Background with Gradient*/}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-teal-600/30 backdrop-blur-sm border border-white/10 shadow-2xl animate-float-slow">
       
            <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
             <img src="bg.jpg" alt="User" className="absolute inset-0 h-full w-full object-cover rounded-3xl" />
          </div>

          {/* Floating Glassmorphism Cards */}
          <div className="absolute top-16 left-8 bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-purple-500/30 animate-float-delay-1 w-72 z-20 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-purple-500/30 rounded-xl shadow-lg shadow-purple-500/20">
                <CalendarDays className="h-6 w-6 text-purple-300" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Upcoming</p>
                <p className="font-bold text-white text-base">Tech Conference 2024</p>
              </div>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-full w-[70%] shadow-[0_0_12px_rgba(168,85,247,0.6)] animate-pulse"></div>
            </div>
            <p className="text-xs text-slate-400 mt-2.5 text-right font-semibold">70% Sold Out</p>
          </div>

          <div className="absolute bottom-24 right-8 bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-red-500/30 animate-float-delay-2 z-20 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-4">
              <div className="relative">
                <span className="absolute -top-1 -right-1 flex h-4 w-4 z-10">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]"></span>
                </span>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 ring-2 ring-red-500/50 shadow-lg flex items-center justify-center text-2xl">
                  🎵
                </div>
              </div>
              <div>
                <p className="font-bold text-white text-lg">Live Now</p>
                <p className="text-sm text-slate-300">Music Festival 2024</p>
              </div>
            </div>
          </div>

          {/* Additional floating badge */}
          <div className="absolute top-1/2 right-4 bg-slate-900/80 backdrop-blur-xl px-4 py-3 rounded-full shadow-2xl border border-teal-500/30 animate-float z-20">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-bold text-sm">4.9/5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

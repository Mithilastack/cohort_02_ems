'use client';
import { useState } from 'react';
import { ArrowRight, Check, Users, Calendar, Share2, BarChart3, Lock, Zap, Headphones } from 'lucide-react'



export default function HowItWorks() {
    const [activeTab, setActiveTab] = useState<'organizer' | 'attendee'>('organizer');

    const steps = [
        {
            number: '01',
            title: 'Create an Account',
            description: 'Sign up in seconds with secure authentication',
            details: ['Email verification', 'Choose your role', 'Profile setup'],
            icon: '👤'
        },
        {
            number: '02',
            title: 'Create or Discover',
            description: 'Build events or browse what\'s happening',
            details: ['Add event details', 'Set pricing', 'Browse by category'],
            icon: '🎯'
        },
        {
            number: '03',
            title: 'Publish & Promote',
            description: 'Go live and reach your audience instantly',
            details: ['One-click publish', 'Shareable links', 'Social media integration'],
            icon: '🚀'
        },
        {
            number: '04',
            title: 'Book & Manage',
            description: 'Attendees book, organizers track everything',
            details: ['Online tickets', 'Guest management', 'Real-time availability'],
            icon: '🎫'
        },
        {
            number: '05',
            title: 'Track & Analyze',
            description: 'Monitor performance with live insights',
            details: ['Live dashboard', 'Attendance tracking', 'Revenue reports'],
            icon: '📊'
        }
    ];

    const benefits = [
        { icon: <Zap className="w-6 h-6" />, title: 'No Technical Skills', description: 'Intuitive interface anyone can use' },
        { icon: <Lock className="w-6 h-6" />, title: 'Secure Payments', description: 'Industry-standard encryption & compliance' },
        { icon: <Users className="w-6 h-6" />, title: 'Mobile-Friendly', description: 'Perfect experience on any device' },
        { icon: <BarChart3 className="w-6 h-6" />, title: 'Fast Setup', description: 'Launch your event in minutes' },
        { icon: <Headphones className="w-6 h-6" />, title: '24/7 Support', description: 'Expert help whenever you need it' },
        { icon: <Share2 className="w-6 h-6" />, title: 'Social Integration', description: 'Share effortlessly across platforms' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/2 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                    <div className="absolute top-40 right-0 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                </div>

                <div className="relative max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-200 via-blue-200 to-amber-200 bg-clip-text text-transparent">
                        How It Works
                    </h1>
                    <p className="text-xl text-gray-300 mb-4">From Idea to Successful Event</p>
                    <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
                        Create, manage, and host events effortlessly in just a few steps. Whether you're an organizer or attendee, our platform makes it simple.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                            Create Your Event <ArrowRight className="w-4 h-4" />
                        </button>
                        <button className="px-8 py-3 border-2 border-amber-400 text-amber-400 rounded-lg font-semibold hover:bg-amber-400/10 transition-all duration-300">
                            Explore Events
                        </button>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                            5 Simple Steps to Success
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Follow our proven workflow to create or discover amazing events</p>
                    </div>

                    {/* Desktop Timeline */}
                    <div className="hidden lg:block">
                        <div className="grid grid-cols-5 gap-8">
                            {steps.map((step, index) => (
                                <div key={index} className="relative group">
                                    {/* Connecting Line */}
                                    {index < steps.length - 1 && (
                                        <div className="absolute top-24 left-1/2 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 transform -translate-y-1/2" />
                                    )}

                                    {/* Card */}
                                    <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 group-hover:bg-white/10 group-hover:shadow-2xl group-hover:shadow-purple-500/20">
                                        <div className="text-4xl mb-4">{step.icon}</div>
                                        <div className="text-amber-400 text-sm font-bold mb-2">{step.number}</div>
                                        <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                                        <p className="text-sm text-gray-400 mb-4">{step.description}</p>
                                        <ul className="space-y-2">
                                            {step.details.map((detail, i) => (
                                                <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                                                    <Check className="w-3 h-3 text-amber-400" /> {detail}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile & Tablet Timeline */}
                    <div className="lg:hidden space-y-6">
                        {steps.map((step, index) => (
                            <div key={index} className="flex gap-6">
                                <div className="flex flex-col items-center">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-xl mb-2">
                                        {step.number.charAt(0)}
                                    </div>
                                    {index < steps.length - 1 && <div className="w-1 h-20 bg-gradient-to-b from-purple-500 to-transparent" />}
                                </div>
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex-1">
                                    <div className="text-2xl mb-2">{step.icon}</div>
                                    <h3 className="font-bold mb-1">{step.title}</h3>
                                    <p className="text-sm text-gray-400 mb-3">{step.description}</p>
                                    <ul className="space-y-1">
                                        {step.details.map((detail, i) => (
                                            <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                                                <Check className="w-3 h-3 text-amber-400" /> {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Organizer vs Attendee */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                        Choose Your Path
                    </h2>
                    <p className="text-center text-gray-400 mb-16">Whether you're organizing or attending, we've got you covered</p>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Organizer */}
                        <div
                            onClick={() => setActiveTab('organizer')}
                            className={`cursor-pointer bg-white/5 backdrop-blur-xl border rounded-2xl p-8 transition-all duration-300 ${
                                activeTab === 'organizer'
                                    ? 'border-purple-500 bg-white/10 shadow-2xl shadow-purple-500/20'
                                    : 'border-white/10 hover:border-purple-500/30'
                            }`}
                        >
                            <div className="text-5xl mb-4">🎪</div>
                            <h3 className="text-2xl font-bold mb-6">For Organizers</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                    <span>Create & manage events with ease</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                    <span>Control ticket pricing & availability</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                    <span>Access powerful analytics dashboard</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                    <span>Manage attendees & bookings</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                    <span>Promote with built-in tools</span>
                                </li>
                            </ul>
                        </div>

                        {/* Attendee */}
                        <div
                            onClick={() => setActiveTab('attendee')}
                            className={`cursor-pointer bg-white/5 backdrop-blur-xl border rounded-2xl p-8 transition-all duration-300 ${
                                activeTab === 'attendee'
                                    ? 'border-blue-500 bg-white/10 shadow-2xl shadow-blue-500/20'
                                    : 'border-white/10 hover:border-blue-500/30'
                            }`}
                        >
                            <div className="text-5xl mb-4">🎟️</div>
                            <h3 className="text-2xl font-bold mb-6">For Attendees</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                    <span>Discover events by category & location</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                    <span>Secure online ticket booking</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                    <span>View your booking history</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                    <span>Get instant confirmation & reminders</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                    <span>Share events with friends</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                        Why It's So Easy
                    </h2>
                    <p className="text-center text-gray-400 mb-16">Built for simplicity, powered by technology</p>

                    <div className="grid md:grid-cols-3 gap-6">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-amber-400/50 transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:shadow-amber-400/20"
                            >
                                <div className="text-amber-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {benefit.icon}
                                </div>
                                <h3 className="font-bold mb-2">{benefit.title}</h3>
                                <p className="text-sm text-gray-400">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-amber-600/20" />
                    <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                </div>

                <div className="relative max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-200 via-blue-200 to-amber-200 bg-clip-text text-transparent">
                        Ready to Host or Join Your Next Event?
                    </h2>
                    <p className="text-gray-400 mb-12 text-lg">
                        Join thousands of organizers and attendees already using our platform to create unforgettable experiences.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                            Get Started Free <ArrowRight className="w-5 h-5" />
                        </button>
                        <button className="px-8 py-4 border-2 border-amber-400 text-amber-400 rounded-lg font-semibold hover:bg-amber-400/10 transition-all duration-300">
                            View Live Events
                        </button>
                    </div>

                    <p className="text-gray-500 text-sm mt-8">No credit card required • Free forever plan available</p>
                </div>
            </section>
        </div>
    );
}
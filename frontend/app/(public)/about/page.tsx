'use client';
import { ArrowRight, Zap, Shield, TrendingUp, Users, Lock, Sparkles } from 'lucide-react';

interface ValueCard {
    icon: React.ReactNode;
    title: string;
    description: string;
}

interface StatCard {
    number: string;
    label: string;
}

const values: ValueCard[] = [
    { icon: <Zap className="w-8 h-8" />, title: "Innovation", description: "Cutting-edge solutions for modern event challenges" },
    { icon: <Shield className="w-8 h-8" />, title: "Reliability", description: "Enterprise-grade infrastructure you can trust" },
    { icon: <Users className="w-8 h-8" />, title: "Customer-First", description: "Your success is our priority" },
    { icon: <Lock className="w-8 h-8" />, title: "Security", description: "Industry-leading data protection" },
    { icon: <TrendingUp className="w-8 h-8" />, title: "Transparency", description: "Clear communication, no hidden fees" },
];

const stats: StatCard[] = [
    { number: "50K+", label: "Events Hosted" },
    { number: "5M+", label: "Tickets Sold" },
    { number: "100K+", label: "Active Users" },
];

const features = [
    "End-to-end event management",
    "Secure ticketing & payments",
    "Real-time analytics",
    "Scalable for all event sizes",
    "Modern UI & seamless UX",
];

export default function AboutPage() {
    return (
        <main className="bg-gray-950 text-white overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
                    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-amber-300 bg-clip-text text-transparent">
                        About Us — Redefining Event Management
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8">
                        We simplify the way events are planned, managed, and experienced.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                            Start Your Event
                        </button>
                        <button className="px-8 py-4 border border-purple-500 rounded-lg font-semibold hover:bg-purple-950 transition-all">
                            Explore Events
                        </button>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 px-4 max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-2xl p-8 md:p-12">
                    <h2 className="text-4xl font-bold mb-6 text-amber-300">Our Story</h2>
                    <p className="text-lg text-gray-300 leading-relaxed mb-4">
                        We started with a simple idea — managing events should be effortless. From small gatherings to large-scale conferences, our platform empowers organizers to focus on experiences, not complexity.
                    </p>
                    <p className="text-lg text-gray-400">
                        Traditional event management platforms are outdated, fragmented, and disconnected. Event organizers waste countless hours juggling multiple tools, managing ticketing headaches, and struggling with attendee communication. We built a solution that brings it all together—a unified, intelligent platform where every aspect of event management works seamlessly.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold mb-12 text-center">Mission & Vision</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-500/50 rounded-2xl p-8 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
                            <Sparkles className="w-10 h-10 text-amber-300 mb-4" />
                            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                            <p className="text-gray-300">
                                To make event creation simple, fast, and accessible for everyone, regardless of their size or budget.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-500/50 rounded-2xl p-8 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
                            <Zap className="w-10 h-10 text-amber-300 mb-4" />
                            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                            <p className="text-gray-300">
                                To become the most trusted and innovative event management platform globally, empowering millions of memorable experiences.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* What Makes Us Different */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold mb-12 text-center">What Makes Us Different</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {features.map((feature, idx) => (
                            <div key={idx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-purple-500/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <ArrowRight className="w-5 h-5 text-amber-300 flex-shrink-0" />
                                    <p className="text-lg font-semibold">{feature}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold mb-12 text-center">Our Core Values</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {values.map((value, idx) => (
                            <div key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all group">
                                <div className="text-amber-300 mb-3 group-hover:scale-110 transition-transform">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                                <p className="text-gray-400">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold mb-12 text-center">Trusted By Thousands</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <p className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                                    {stat.number}
                                </p>
                                <p className="text-gray-400 text-lg">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10" />
                </div>
                <div className="relative z-10 max-w-2xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Let's Build Memorable Events Together
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Join thousands of event organizers who trust us with their most important moments.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2">
                            Get Started Free <ArrowRight className="w-5 h-5" />
                        </button>
                        <button className="px-8 py-4 border border-purple-500 rounded-lg font-semibold hover:bg-purple-950 transition-all">
                            Contact Us
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
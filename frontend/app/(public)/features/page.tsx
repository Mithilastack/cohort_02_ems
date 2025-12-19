import React from 'react';
import { Sparkles, Calendar, Users, Shield, Zap, Globe, BarChart } from 'lucide-react';

export default function FeaturesPage() {
    const features = [
        {
            icon: <Calendar className="w-6 h-6 text-purple-400" />,
            title: "Smart Scheduling",
            description: "Automated conflict detection and intelligent resource allocation for seamless event planning."
        },
        {
            icon: <Users className="w-6 h-6 text-blue-400" />,
            title: "Attendee Management",
            description: "Comprehensive tools to track registrations, check-ins, and attendee engagement in real-time."
        },
        {
            icon: <Shield className="w-6 h-6 text-emerald-400" />,
            title: "Secure Payments",
            description: "Integrated payment processing with enterprise-grade security and multiple currency support."
        },
        {
            icon: <Zap className="w-6 h-6 text-yellow-400" />,
            title: "Real-time Analytics",
            description: "Deep insights into event performance, ticket sales, and user engagement metrics."
        },
        {
            icon: <Globe className="w-6 h-6 text-cyan-400" />,
            title: "Hybrid Events",
            description: "Seamlessly bridge physical and virtual experiences with our integrated streaming tools."
        },
        {
            icon: <BarChart className="w-6 h-6 text-rose-400" />,
            title: "Custom Reporting",
            description: "Generate detailed reports and visualize data to make informed decisions for future events."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6">
                        Powerful Features for <br />
                        <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Modern Events</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Everything you need to create, manage, and scale exceptional events. From planning to execution, we've got you covered.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="group p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/10">
                            <div className="w-12 h-12 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-slate-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="mt-24 p-12 rounded-3xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/10 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-slate-950/50 z-0"></div>
                    <div className="relative z-10">
                        <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
                        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                            Join thousands of event organizers who are already using EventMS to power their events.
                        </p>
                        <button className="px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-purple-50 transition-colors">
                            Get Started Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

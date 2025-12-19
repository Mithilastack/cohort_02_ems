import React from 'react';
import { Search, Book, MessageCircle, FileText, ChevronRight } from 'lucide-react';

export default function HelpCenterPage() {
    const categories = [
        {
            icon: <Book className="w-6 h-6 text-purple-400" />,
            title: "Getting Started",
            articles: ["Account Setup", "Creating your first event", "Platform tour"]
        },
        {
            icon: <FileText className="w-6 h-6 text-blue-400" />,
            title: "Event Management",
            articles: ["Managing tickets", "Checking in attendees", "Customizing event pages"]
        },
        {
            icon: <MessageCircle className="w-6 h-6 text-emerald-400" />,
            title: "Account & Billing",
            articles: ["Subscription plans", "Payment methods", "Updating profile"]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">

                {/* Hero Search */}
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8">
                        How can we help you?
                    </h1>
                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                        <div className="relative flex items-center bg-slate-900 rounded-2xl border border-white/10 shadow-xl overflow-hidden">
                            <Search className="w-6 h-6 text-slate-400 ml-6" />
                            <input
                                type="text"
                                placeholder="Search for answers..."
                                className="w-full py-5 px-6 bg-transparent text-lg text-white placeholder:text-slate-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                        <div key={index} className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 hover:border-purple-500/30 transition-all duration-300">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center">
                                    {category.icon}
                                </div>
                                <h2 className="text-xl font-bold text-white">{category.title}</h2>
                            </div>
                            <ul className="space-y-4">
                                {category.articles.map((article, idx) => (
                                    <li key={idx}>
                                        <a href="#" className="flex items-center justify-between group/link text-slate-400 hover:text-purple-400 transition-colors">
                                            <span>{article}</span>
                                            <ChevronRight className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity transform group-hover/link:translate-x-1" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <button className="mt-8 text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors">
                                View all articles &rarr;
                            </button>
                        </div>
                    ))}
                </div>

                {/* Contact Support */}
                <div className="mt-20 text-center">
                    <p className="text-slate-400 mb-4">Can't find what you're looking for?</p>
                    <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-200 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        Contact Support
                    </a>
                </div>

            </div>
        </div>
    );
}

import React from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Contact Info */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                            Get in touch
                        </h1>
                        <p className="text-lg text-slate-400 mb-12 leading-relaxed">
                            Have a question about our features, pricing, or enterprise solutions? Our team is ready to answer all your questions.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Chat with us</h3>
                                    <p className="text-slate-400 mb-2">Speak to our friendly team via email.</p>
                                    <a href="mailto:support@eventms.com" className="text-white font-semibold hover:text-purple-400 transition-colors">support@eventms.com</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Visit us</h3>
                                    <p className="text-slate-400 mb-2">Come say hello at our office HQ.</p>
                                    <address className="text-white font-semibold not-italic">
                                        100 Smith Street<br />
                                        Collingwood VIC 3066 AU
                                    </address>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Call us</h3>
                                    <p className="text-slate-400 mb-2">Mon-Fri from 8am to 5pm.</p>
                                    <a href="tel:+15550000000" className="text-white font-semibold hover:text-emerald-400 transition-colors">+1 (555) 000-0000</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 lg:p-12 shadow-2xl">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300">First name</label>
                                    <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300">Last name</label>
                                    <input type="text" className="w-full bg-slate-800 border-slate-700 border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" placeholder="Doe" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300">Email</label>
                                <input type="email" className="w-full bg-slate-800 border-slate-700 border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" placeholder="john@example.com" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300">Message</label>
                                <textarea rows={4} className="w-full bg-slate-800 border-slate-700 border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" placeholder="Tell us how we can help..."></textarea>
                            </div>

                            <button type="button" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-purple-500/25">
                                <Send className="w-4 h-4" />
                                Send Message
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}

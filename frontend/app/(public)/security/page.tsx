import React from 'react';
import { Shield, Lock, Server, FileCheck, Eye, Key } from 'lucide-react';

export default function SecurityPage() {
    const securityFeatures = [
        {
            icon: <Lock className="w-8 h-8 text-emerald-400" />,
            title: "End-to-End Encryption",
            description: "All sensitive data is encrypted at rest and in transit using industry-standard TLS 1.3 and AES-256 protocols."
        },
        {
            icon: <Server className="w-8 h-8 text-blue-400" />,
            title: "Secure Infrastructure",
            description: "Hosted on enterprise-grade cloud infrastructure with 24/7 monitoring, automated backups, and redundancy."
        },
        {
            icon: <FileCheck className="w-8 h-8 text-purple-400" />,
            title: "GDPR Compliance",
            description: "Fully compliant with GDPR, CCPA, and other global data privacy regulations to protect user rights."
        },
        {
            icon: <Eye className="w-8 h-8 text-yellow-400" />,
            title: "Continuous Monitoring",
            description: "Real-time threat detection and vulnerability scanning to identify and neutralize potential risks instantly."
        },
      
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-20">
                    <div className="inline-block p-4 rounded-2xl bg-emerald-500/10 mb-6">
                        <Shield className="w-12 h-12 text-emerald-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6">
                        Security at <span className="text-white">EventMS</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Your trust is our top priority. We employ state-of-the-art security measures to ensure your data is always protected.
                    </p>
                </div>

                <div className="space-y-8">
                    {securityFeatures.map((feature, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-8 items-start p-8 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-emerald-500/30 transition-colors">
                            <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center flex-shrink-0">
                                {feature.icon}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-lg">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center p-8 rounded-3xl border border-white/10 bg-slate-900/30">
                    <h3 className="text-xl font-bold text-white mb-4">Have specific security questions?</h3>
                    <p className="text-slate-400 mb-6">Our security team is here to help you with any concerns or compliance requirements.</p>
                    <a href="mailto:security@eventms.com" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors">
                        Contact Security Team &rarr;
                    </a>
                </div>
            </div>
        </div>
    );
}

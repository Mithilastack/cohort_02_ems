import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react';

export default function StatusPage() {
    const systems = [
        { name: "API", status: "operational", uptime: "99.99%" },
        { name: "Dashboard", status: "operational", uptime: "99.95%" },
        { name: "Ticket Processing", status: "operational", uptime: "100.00%" },
        { name: "Email Notifications", status: "degraded", uptime: "98.50%" },
        { name: "Payment Gateway Integration", status: "operational", uptime: "99.99%" },
        { name: "CDN / Static Assets", status: "operational", uptime: "99.99%" },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "operational": return <CheckCircle className="w-5 h-5 text-emerald-400" />;
            case "degraded": return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
            case "down": return <XCircle className="w-5 h-5 text-red-400" />;
            default: return <Activity className="w-5 h-5 text-slate-400" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "operational": return "Operational";
            case "degraded": return "Degraded Performance";
            case "down": return "Service Outage";
            default: return "Unknown";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "operational": return "text-emerald-400";
            case "degraded": return "text-yellow-400";
            case "down": return "text-red-400";
            default: return "text-slate-400";
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-white mb-4">System Status</h1>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                        <CheckCircle className="w-5 h-5" />
                        <span>All systems operational</span>
                    </div>
                </div>

                <div className="bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 bg-slate-900 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-white">Current Status</h2>
                        <span className="text-sm text-slate-400">Refreshed just now</span>
                    </div>

                    {/* List */}
                    <div className="divide-y divide-white/5">
                        {systems.map((system, index) => (
                            <div key={index} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center gap-4">
                                    {getStatusIcon(system.status)}
                                    <span className="font-medium text-slate-200">{system.name}</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="hidden sm:block text-sm text-slate-500 font-mono">{system.uptime} uptime</span>
                                    <span className={`text-sm font-bold ${getStatusColor(system.status)}`}>
                                        {getStatusText(system.status)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* History */}
                <div className="mt-12">
                    <h3 className="text-xl font-bold text-white mb-6">Past Incidents</h3>
                    <div className="space-y-4">
                        <div className="p-6 rounded-2xl bg-slate-900/30 border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-bold text-yellow-400">Degraded Performance</span>
                                <span className="text-sm text-slate-500">- Dec 18, 2025</span>
                            </div>
                            <p className="text-slate-300">We experienced a brief delay in email delivery services. The issue has been identified and resolved.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-900/30 border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-bold text-emerald-400">Scheduled Maintenance</span>
                                <span className="text-sm text-slate-500">- Dec 10, 2025</span>
                            </div>
                            <p className="text-slate-300">Successfully completed scheduled database upgrades. No downtime occurred.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

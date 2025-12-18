"use client";
import React, { useState } from "react";
import { Sparkles } from "lucide-react";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");

  const footerLinks = {
    Platform: ["Features", "Pricing", "Security"],
    Company: ["About", "Blog", "Careers"],
    Support: ["Help Center", "Contact Us", "Status"],
  };

  const socialLinks = [
    { label: "Twitter", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "Instagram", href: "#" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ];

  return (
    <footer className="border-t border-slate-800 bg-slate-900/50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold">EventMS</span>
            </div>
            <p className="text-slate-400 text-sm">The ultimate event management platform</p>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold mb-4">{title}</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-white transition">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h4 className="font-bold mb-4">Newsletter</h4>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-purple-500 placeholder-slate-500"
              />
              <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <p className="text-slate-400 text-sm">
            &copy; 2025 EventMS. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-6 md:mt-0">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-slate-400 hover:text-white transition"
              >
                <span className="text-sm">{link.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Legal Links */}
        <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
          {legalLinks.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-slate-300 transition">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

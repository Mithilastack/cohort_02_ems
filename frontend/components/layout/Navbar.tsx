"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Menu, X, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
interface NavbarProps {
  onGetStarted?: () => void;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onGetStarted }) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Helper function to get cookie
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  // Handle logout
  const handleLogout = () => {
    // Remove cookies
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "user=; path=/; max-age=0";

    // Update state
    setIsLoggedIn(false);
    setUser(null);
    setDropdownOpen(false);

    // Redirect to home
    router.push("/");
  };

  useEffect(() => {
    // Check if user is logged in
    const token = getCookie("token");
    const userData = getCookie("user");

    if (token && userData) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  // Close dropdown on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (dropdownOpen) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dropdownOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (dropdownOpen && !target.closest(".profile-dropdown-container")) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
    { label: "How It Works", href: "/HowItWorks" },
    { label: "Events", href: "/events" },
    { label: "About Us", href: "/about" },
  ];

  return (
    <nav className="fixed w-full top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center">
                <Image src="/images/logo.png" alt="Logo" width={50} height={50} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                EventMS
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-slate-300 hover:text-white transition"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Buttons / Profile Section */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link href="/login">
                  <button className="px-6 py-2 text-sm font-medium text-slate-300 hover:text-white transition">
                    Sign In
                  </button>
                </Link>
                <Link href="/register">
                  <button
                    onClick={onGetStarted}
                    className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition"
                  >
                    Get Started
                  </button>
                </Link>
              </>
            ) : (
              /* Profile Dropdown */
              <div className="relative profile-dropdown-container">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg  transition"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-slate-700">
                      <p className="text-sm text-slate-300">{user?.email}</p>
                      <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                    </div>
                    <Link href="/user/profile">
                      <button
                        onClick={() => setDropdownOpen(false)}
                        className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition text-sm"
                      >
                        <User className="w-4 h-4" />
                        Profile Settings
                      </button>
                    </Link>
                    <Link href="/bookings">
                      <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        My Bookings
                      </button>
                    </Link>
                    <Link href="/wishlist">
                      <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        My Wishlist
                      </button>
                    </Link>
                    <Link href="/chnagePassword">
                      <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Change Password
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-red-400 hover:bg-slate-800 flex items-center gap-2 transition text-sm border-t border-slate-700"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-slate-300 hover:text-white transition"
              >
                {link.label}
              </a>
            ))}
            {!isLoggedIn ? (
              <button className="w-full px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-lg">
                Get Started
              </button>
            ) : (
              <>
                <div className="px-4 py-2 border-t border-slate-700">
                  <p className="text-sm text-slate-300 font-medium">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <Link href="/profile">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition text-sm"
                  >
                    <User className="w-4 h-4" />
                    Profile Settings
                  </button>
                </Link>
                <Link href="/bookings">
                      <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        My Bookings
                      </button>
                    </Link>
                    <Link href="/wishlist">
                      <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        My Wishlist
                      </button>
                    </Link>
                <Link href="/chnagePassword">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Change Password
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-red-400 hover:bg-slate-800 flex items-center gap-2 transition text-sm border-t border-slate-700"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

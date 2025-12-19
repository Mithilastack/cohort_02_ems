'use client'

import React, { useEffect, useState } from "react";
import { EventCard } from "./EventCard";
import { fetchEvents, Event } from "@/lib/eventApi";
import { fetchWishlist, addToWishlist, removeFromWishlist } from "@/lib/wishlistApi";
import { Button } from "@/components/ui/Button"; // Assuming Button component exists
import Link from "next/link";
import { useRouter } from "next/navigation";

export const EventsSection: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistEventIds, setWishlistEventIds] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const data = await fetchWishlist();
        if (data.success) {
          const ids = new Set(data.data.wishlist.map(event => event._id));
          setWishlistEventIds(ids);
        }
      } catch (err) {
        // User might not be logged in, silently fail
        console.log('Could not fetch wishlist:', err);
      }
    };

    loadWishlist();
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetchEvents({ limit: 4 });
        if (response.success) {
          setEvents(response.data.events);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <section id="events" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50 border-y border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="text-blue-400">Events</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Discover amazing events happening now on our platform
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-[380px] rounded-3xl bg-slate-800/40 animate-pulse border border-white/5"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  type={event.category}
                  title={event.title}
                  date={formatDate(event.date)}
                  location={event.venue}
                  image={event.bannerUrl || "bg-gradient-to-br from-purple-600 to-pink-600"} // Fallback or handling for color vs url
                  attendees={`${event.totalSeats - event.availableSeats} attending`}
                  onBookNow={() => router.push(`/events/${event._id}`)}
                />
              ))}
            </div>

            <div className="flex justify-center">
              <Link href="/events">
                <Button className="rounded-full px-8 py-6 text-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
                  View All Events
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

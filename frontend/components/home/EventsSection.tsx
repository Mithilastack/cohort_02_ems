import React from "react";
import { EventCard } from "./EventCard";

interface Event {
  type: string;
  title: string;
  date: string;
  location: string;
  image: string;
  attendees: string;
}

const events: Event[] = [
  {
    type: "🎤 Concert",
    title: "Summer Music Fest 2025",
    date: "June 15, 2025",
    location: "Central Park, NYC",
    image: "bg-gradient-to-br from-purple-600 to-pink-600",
    attendees: "8,234 going",
  },
  {
    type: "💍 Wedding",
    title: "Elegant Garden Wedding",
    date: "May 22, 2025",
    location: "Riverside Venue, LA",
    image: "bg-gradient-to-br from-rose-600 to-orange-600",
    attendees: "342 attending",
  },
  {
    type: "🎓 College Event",
    title: "Tech Summit 2025",
    date: "April 10, 2025",
    location: "Silicon Valley Convention Center",
    image: "bg-gradient-to-br from-blue-600 to-cyan-600",
    attendees: "5,612 registered",
  },
  {
    type: "🏢 Corporate",
    title: "Global Business Conference",
    date: "July 3, 2025",
    location: "Downtown Chicago",
    image: "bg-gradient-to-br from-indigo-600 to-blue-600",
    attendees: "3,421 attending",
  },
];

export const EventsSection: React.FC = () => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event, index) => (
            <EventCard
              key={index}
              type={event.type}
              title={event.title}
              date={event.date}
              location={event.location}
              image={event.image}
              attendees={event.attendees}
              onBookNow={() => console.log(`Booking ${event.title}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

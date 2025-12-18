import React from "react";
import { Calendar, MapPin } from "lucide-react";
import { Card } from "../ui/Card";

interface EventCardProps {
  type: string;
  title: string;
  date: string;
  location: string;
  image: string;
  attendees: string;
  onBookNow?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  type,
  title,
  date,
  location,
  image,
  attendees,
  onBookNow,
}) => {
  return (
    <Card variant="default" className="group cursor-pointer overflow-hidden hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition">
      {/* Event Image */}
      <div className={`${image} h-40 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
        <div className="absolute top-4 left-4 text-2xl">{type}</div>
      </div>

      {/* Event Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 group-hover:text-purple-400 transition">
          {title}
        </h3>

        <div className="space-y-2 mb-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>{location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          <span className="text-xs text-slate-500">{attendees}</span>
          <button
            onClick={onBookNow}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition"
          >
            Book Now
          </button>
        </div>
      </div>
    </Card>
  );
};

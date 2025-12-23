import React from "react";
import { Calendar, MapPin, Heart } from "lucide-react";
import { Card } from "../ui/Card";
import Image from "next/image";

interface EventCardProps {
  type: string;
  title: string;
  date: string;
  location: string;
  image: string;
  attendees: string;
  onBookNow?: () => void;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  type,
  title,
  date,
  location,
  image,
  attendees,
  onBookNow,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  // Check if image is a URL or gradient class
  const isImageUrl = image.startsWith('http://') || image.startsWith('https://');

  return (
    <Card variant="default" className="group cursor-pointer overflow-hidden hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition">
      {/* Event Image */}
      <div className={`h-40 relative overflow-hidden ${!isImageUrl ? image : ''}`}>
        {/* Display actual image if URL is provided */}
        {isImageUrl && (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        )}

        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
        <div className="absolute top-4 left-4 text-2xl z-10">{type}</div>

        {/* Wishlist Heart Icon */}
        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all duration-300 transform hover:scale-110 z-10"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 ${isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-white hover:text-red-400"
                }`}
            />
          </button>
        )}
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

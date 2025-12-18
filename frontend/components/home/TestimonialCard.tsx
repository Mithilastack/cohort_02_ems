import React from "react";
import { Star } from "lucide-react";
import { Card } from "../ui/Card";

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  avatar: string;
  text: string;
  rating: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  company,
  avatar,
  text,
  rating,
}) => {
  return (
    <Card variant="premium" className="p-8 hover:shadow-lg hover:shadow-amber-500/10">
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>

      {/* Testimonial Text */}
      <p className="text-slate-300 mb-6 leading-relaxed">"{text}"</p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center font-bold">
          {avatar}
        </div>
        <div>
          <div className="font-bold">{name}</div>
          <div className="text-sm text-slate-400">{role}</div>
          <div className="text-xs text-slate-500">{company}</div>
        </div>
      </div>
    </Card>
  );
};

import React from "react";
import { TestimonialCard } from "./TestimonialCard";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "Wedding Planner",
    company: "Elegant Events Co.",
    avatar: "SJ",
    text: "EMS transformed how I manage weddings. The guest management and payment processing are seamless!",
    rating: 5,
  },
  {
    name: "Marcus Chen",
    role: "Event Director",
    company: "Tech Conferences Inc.",
    avatar: "MC",
    text: "Best platform for corporate events. The analytics dashboard gives us valuable insights we never had before.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "College Event Coordinator",
    company: "Stanford University",
    avatar: "PP",
    text: "Managing 10+ events per semester is now effortless. Our students love the easy ticket booking process.",
    rating: 5,
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by <span className="text-purple-400">Industry Leaders</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            See what event professionals are saying about EventMS
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              role={testimonial.role}
              company={testimonial.company}
              avatar={testimonial.avatar}
              text={testimonial.text}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

import React from "react";
import { LucideIcon } from "lucide-react";
import { Card } from "../ui/Card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <Card variant="gradient" className="group p-6 hover:shadow-lg hover:shadow-purple-500/10">
      <div className="mb-4">
        <div className="inline-block p-3 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg group-hover:from-purple-600/40 group-hover:to-blue-600/40 transition">
          <Icon className="w-6 h-6 text-purple-400" />
        </div>
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </Card>
  );
};

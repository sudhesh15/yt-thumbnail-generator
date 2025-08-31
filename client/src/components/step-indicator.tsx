import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  step: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}

export default function StepIndicator({ step, title, isActive, isCompleted }: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center relative">
      <div 
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center font-semibold mb-2 transition-colors",
          isCompleted 
            ? "bg-success text-white" 
            : isActive 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-muted-foreground"
        )}
        data-testid={`step-indicator-${step}`}
      >
        {isCompleted ? <Check className="w-5 h-5" /> : step}
      </div>
      <span 
        className={cn(
          "text-sm font-medium",
          isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {title}
      </span>
      
      {/* Connector line */}
      {step < 4 && (
        <div 
          className={cn(
            "absolute top-6 left-full w-16 lg:w-24 h-0.5 transition-colors",
            isCompleted ? "bg-primary" : "bg-border"
          )}
        />
      )}
    </div>
  );
}

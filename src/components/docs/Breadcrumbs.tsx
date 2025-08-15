import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  id: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (id: string) => void;
  className?: string;
}

export const Breadcrumbs = ({ items, onNavigate, className }: BreadcrumbsProps) => {
  if (items.length === 0) return null;

  return (
    <nav className={cn("flex items-center space-x-2 text-sm", className)} aria-label="Breadcrumb">
      <button
        onClick={() => onNavigate("overview")}
        className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors duration-200"
        aria-label="Go to overview"
      >
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </button>

      {items.map((item, index) => (
        <div key={item.id} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          
          {index === items.length - 1 ? (
            <span className="font-medium text-foreground" aria-current="page">
              {item.label}
            </span>
          ) : (
            <button
              onClick={() => onNavigate(item.id)}
              className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
            >
              {item.label}
            </button>
          )}
        </div>
      ))}
    </nav>
  );
};
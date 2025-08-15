import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const MobileHeader = ({ isSidebarOpen, onToggleSidebar }: MobileHeaderProps) => {
  return (
    <header className="lg:hidden bg-background border-b border-border-light sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="hover:bg-sidebar-hover transition-colors duration-200"
            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
          
          <div>
            <h1 className="text-lg font-bold text-heading">AHD Docs</h1>
            <p className="text-xs text-caption">CRM SaaS Guide</p>
          </div>
        </div>
      </div>
    </header>
  );
};
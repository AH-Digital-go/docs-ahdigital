import { useState, useEffect } from "react";
import { DocsSidebar } from "./DocsSidebar";
import { DocsContent } from "./DocsContent";
import { MobileHeader } from "./MobileHeader";
import { ScrollToTop } from "./ScrollToTop";
import { cn } from "@/lib/utils";

export const DocsLayout = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarMini, setIsSidebarMini] = useState(false);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setIsMobileSidebarOpen(false); // Close mobile sidebar when navigating
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader 
        isSidebarOpen={isMobileSidebarOpen}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />
      
      <div className="flex h-screen lg:h-screen">
        {/* Mobile Overlay */}
        {/* {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )} */}
        
        {/* Sidebar */}
        <div className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto transition-transform duration-300 lg:translate-x-0",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <DocsSidebar 
            activeSection={activeSection} 
            onSectionChange={handleSectionChange}

          />
        </div>

        {/* Content */}
        <DocsContent 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange}
        />
      </div>
      
      <ScrollToTop />
    </div>
  );
};
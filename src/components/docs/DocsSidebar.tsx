import { useState } from "react";
import { ChevronRight, Book, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import docsData from "../../../data.json"; // <- JSON import

interface Section {
  id: string;
  title: string;
  steps?: { step: number; instruction: string; screenshot?: string }[];
}

interface DocsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const DocsSidebar = ({ activeSection, onSectionChange }: DocsSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filterSections = (sections: Section[], query: string): Section[] => {
    if (!query) return sections;
    return sections.filter(section =>
      section.title.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Pull sections from JSON
const filteredSections = filterSections(docsData.sections as unknown as Section[], searchQuery);
  return (
    <div className="w-80 h-full lg:h-screen bg-sidebar border-r border-border-light flex flex-col shadow-lg lg:shadow-none">
      {/* Header */}
      <div className="p-6 border-b border-border-light bg-gradient-subtle">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-gradient-primary rounded-lg shadow-md">
            <Book className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-heading">{docsData.title}</h2>
            <p className="text-sm text-caption">{docsData.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border-light">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {filteredSections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-all duration-300 group",
                  "hover:bg-sidebar-hover hover:shadow-sm",
                  isActive && "bg-sidebar-active text-sidebar-active-foreground shadow-md transform scale-[1.02]"
                )}
              >
                <span className="flex-1 truncate">{section.title}</span>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
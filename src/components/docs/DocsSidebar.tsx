import { useState } from "react";
import { ChevronDown, ChevronRight, Book, Building2, Users, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface NavItem {
  id: string;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    id: "overview",
    title: "Overview",
    icon: Book,
  },
  {
    id: "agency-space",
    title: "Agency Space",
    icon: Building2,
    children: [
      { id: "agency-overview", title: "Overview" },
      { id: "creating-subaccount", title: "Creating a Subaccount" },
      { id: "managing-users", title: "Managing Agency Users" },
    ],
  },
  {
    id: "subaccount-space",
    title: "Subaccount Space",
    icon: Users,
    children: [
      { id: "subaccount-overview", title: "Overview" },
      { id: "main", title: "Main" },
      { id: "launchpad", title: "Launchpad" },
      { id: "dashboard", title: "Dashboard" },
      { id: "conversations", title: "Conversations" },
      { id: "calendars", title: "Calendars" },
      { id: "clients", title: "Clients" },
      { id: "leads", title: "Leads" },
      { id: "forms", title: "Forms" },
      { id: "campaigns", title: "Campaigns" },
      { id: "facebook-ads", title: "Facebook Ads" },
      { id: "emails", title: "Emails" },
      { id: "team-chat", title: "Team Chat" },
      { id: "landing-pages", title: "Landing Pages" },
      { id: "integration-api", title: "Integration API" },
      { id: "knowledge-base", title: "Knowledge Base" },
      { id: "workflows", title: "Workflows" },
      { id: "feedback", title: "Feedback" },
    ],
  },
  {
    id: "faqs",
    title: "FAQs",
    children: [
      { id: "agency-faqs", title: "Agency Space FAQs" },
      { id: "subaccount-faqs", title: "Subaccount Space FAQs" },
    ],
  },
];

interface DocsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const DocsSidebar = ({ activeSection, onSectionChange }: DocsSidebarProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(["agency-space", "subaccount-space", "faqs"])
  );
  const [searchQuery, setSearchQuery] = useState("");

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const filterItems = (items: NavItem[], query: string): NavItem[] => {
    if (!query) return items;
    
    return items.filter(item => {
      const matchesTitle = item.title.toLowerCase().includes(query.toLowerCase());
      const hasMatchingChildren = item.children?.some(child => 
        child.title.toLowerCase().includes(query.toLowerCase())
      );
      return matchesTitle || hasMatchingChildren;
    });
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = activeSection === item.id;
    const Icon = item.icon;

    return (
      <div key={item.id} className="w-full">
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else {
              onSectionChange(item.id);
            }
          }}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-all duration-300 group",
            "hover:bg-sidebar-hover hover:shadow-sm",
            level === 0 ? "font-medium" : "font-normal text-sm",
            level > 0 && "ml-6",
            isActive && "bg-sidebar-active text-sidebar-active-foreground shadow-md transform scale-[1.02]"
          )}
        >
          {Icon && level === 0 && (
            <Icon className={cn(
              "w-4 h-4 flex-shrink-0 transition-all duration-300",
              isActive ? "text-sidebar-active-foreground" : "text-muted-foreground group-hover:text-primary",
              "group-hover:scale-110"
            )} />
          )}
          
          <span className="flex-1 truncate transition-all duration-200">{item.title}</span>
          
          {hasChildren && (
            <div className={cn(
              "transition-all duration-300 ease-spring",
              isExpanded ? "rotate-90" : "rotate-0"
            )}>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            </div>
          )}
        </button>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1 animate-fade-in">
            {item.children!.map((child, index) => (
              <div 
                key={child.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {renderNavItem(child, level + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const filteredItems = filterItems(navigationItems, searchQuery);

  return (
    <div className="w-80 h-full lg:h-screen bg-sidebar border-r border-border-light flex flex-col shadow-lg lg:shadow-none">
      {/* Header */}
      <div className="p-6 border-b border-border-light bg-gradient-subtle">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-gradient-primary rounded-lg shadow-md">
            <Book className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-heading">AHD Documentation</h2>
            <p className="text-sm text-caption">CRM SaaS Platform Guide</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border-light">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
          {filteredItems.map((item) => renderNavItem(item))}
        </nav>
      </div>
    </div>
  );
};
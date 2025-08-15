import { ReactNode } from "react";
import { 
  CheckCircle, 
  Users, 
  Building2, 
  Calendar, 
  MessageSquare, 
  FileText,
  BarChart3,
  Settings,
  Lightbulb,
  HelpCircle,
  ArrowRight,
  Star,
  Zap,
  Shield
} from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";

interface DocsContentProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const ContentSection = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`prose prose-slate max-w-none animate-fade-in ${className}`}>
    {children}
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, featured = false }: { 
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  featured?: boolean;
}) => (
  <div className={`
    group p-6 bg-gradient-card border border-border-light rounded-xl 
    hover:shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-[1.02]
    ${featured ? 'ring-2 ring-primary/20 bg-gradient-hero text-white' : ''}
  `}>
    <div className="flex items-center gap-3 mb-3">
      <div className={`
        p-2 rounded-lg transition-all duration-300 group-hover:scale-110
        ${featured ? 'bg-white/20' : 'bg-primary/10'}
      `}>
        <Icon className={`w-5 h-5 ${featured ? 'text-white' : 'text-primary'}`} />
      </div>
      <h4 className={`font-semibold ${featured ? 'text-white' : 'text-heading'}`}>{title}</h4>
    </div>
    <p className={`text-sm ${featured ? 'text-white/90' : 'text-body'}`}>{description}</p>
  </div>
);

const StepItem = ({ number, title, description }: { 
  number: number;
  title: string;
  description: string;
}) => (
  <div className="group flex gap-4 p-6 bg-gradient-subtle rounded-xl border border-border-light hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
    <div className="flex-shrink-0 w-10 h-10 bg-gradient-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
      {number}
    </div>
    <div className="flex-1">
      <h4 className="font-semibold text-heading mb-2 group-hover:text-primary transition-colors duration-200">{title}</h4>
      <p className="text-body text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

const InfoBox = ({ type = "info", children }: { type?: "info" | "warning" | "tip"; children: ReactNode }) => {
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-800 shadow-blue-100/50",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800 shadow-yellow-100/50",
    tip: "bg-green-50 border-green-200 text-green-800 shadow-green-100/50"
  };

  const icons = {
    info: HelpCircle,
    warning: Shield,
    tip: Lightbulb
  };

  const Icon = icons[type];

  return (
    <div className={`p-5 border rounded-xl shadow-md ${styles[type]} animate-fade-in-scale`}>
      <div className="flex items-start gap-3">
        <div className="p-1 rounded-full bg-white/50">
          <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        </div>
        <div className="text-sm font-medium leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

const getBreadcrumbItems = (activeSection: string) => {
  const breadcrumbMap: Record<string, Array<{ label: string; id: string }>> = {
    "agency-overview": [{ label: "Agency Space", id: "agency-space" }],
    "creating-subaccount": [{ label: "Agency Space", id: "agency-space" }],
    "managing-users": [{ label: "Agency Space", id: "agency-space" }],
    "subaccount-overview": [{ label: "Subaccount Space", id: "subaccount-space" }],
    "main": [{ label: "Subaccount Space", id: "subaccount-space" }],
    "dashboard": [{ label: "Subaccount Space", id: "subaccount-space" }],
    // Add more mappings as needed
  };

  return breadcrumbMap[activeSection] || [];
};

export const DocsContent = ({ activeSection, onSectionChange }: DocsContentProps) => {
  const breadcrumbItems = getBreadcrumbItems(activeSection);
  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <ContentSection>
            <div className="mb-8">
              <h1 className="mb-4">Welcome to AHD Documentation</h1>
              <p className="text-xl text-subheading mb-6">
                This comprehensive guide will walk you through every feature available in your CRM SaaS platform — 
                whether you're working inside a Subaccount or in the Agency space.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <FeatureCard
                icon={Building2}
                title="Agency Space"
                description="Create and manage subaccounts, assign team members, and oversee all workspaces from a centralized hub."
              />
              <FeatureCard
                icon={Users}
                title="Subaccount Space"
                description="Handle daily operations, manage conversations, campaigns, leads, and all client-facing activities."
              />
            </div>

            <h2>What You'll Learn</h2>
            <div className="grid gap-4 mb-8">
              <div className="group flex items-center gap-3 p-5 bg-gradient-subtle rounded-lg border border-border-light hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
                <div className="p-2 bg-green-100 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-medium">Creating and managing subaccounts for different businesses or branches</span>
              </div>
              <div className="group flex items-center gap-3 p-5 bg-gradient-subtle rounded-lg border border-border-light hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
                <div className="p-2 bg-green-100 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-medium">Managing agency users and assigning appropriate permissions</span>
              </div>
              <div className="group flex items-center gap-3 p-5 bg-gradient-subtle rounded-lg border border-border-light hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
                <div className="p-2 bg-green-100 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-medium">Handling daily operations: conversations, campaigns, and lead management</span>
              </div>
              <div className="group flex items-center gap-3 p-5 bg-gradient-subtle rounded-lg border border-border-light hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
                <div className="p-2 bg-green-100 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-medium">Tips and best practices to maximize your CRM efficiency</span>
              </div>
            </div>

            <InfoBox type="tip">
              <strong>Getting Started:</strong> New to the platform? Start with the Agency Space section to set up your workspace, 
              then move to Subaccount Space for day-to-day operations.
            </InfoBox>
          </ContentSection>
        );

      case "agency-overview":
        return (
          <ContentSection>
            <h1>Agency Space Overview</h1>
            <p className="text-xl text-subheading mb-6">
              The Agency space is your main administrative hub where you control the entire ecosystem.
            </p>

            <h2>What You Can Do</h2>
            <div className="grid gap-4 mb-8">
              <FeatureCard
                icon={Building2}
                title="Subaccount Management"
                description="Create and manage independent workspaces for different businesses, clients, or projects."
              />
              <FeatureCard
                icon={Users}
                title="User Administration"
                description="Manage agency users, assign roles, and control access to subaccounts."
              />
              <FeatureCard
                icon={Settings}
                title="Global Settings"
                description="Access billing, global configurations, and agency-wide integrations."
              />
            </div>

            <InfoBox type="info">
              Each subaccount operates independently with its own contacts, campaigns, and analytics, 
              ensuring complete data separation between clients.
            </InfoBox>
          </ContentSection>
        );

      case "creating-subaccount":
        return (
          <ContentSection>
            <h1>Creating a Subaccount</h1>
            <p className="text-xl text-subheading mb-6">
              Learn how to set up independent workspaces for your clients or business divisions.
            </p>

            <h2>What is a Subaccount?</h2>
            <p>
              A subaccount is an independent workspace for a specific business, client, or project. 
              Each subaccount has its own contacts, campaigns, and analytics, completely separated from others.
            </p>

            <h2>Step-by-Step Creation Process</h2>
            <div className="space-y-4 mb-8">
              <StepItem
                number={1}
                title="Navigate to Agency Dashboard"
                description="From your main agency view, locate the subaccount management section."
              />
              <StepItem
                number={2}
                title="Click 'Create Subaccount'"
                description="Find and click the create new subaccount button."
              />
              <StepItem
                number={3}
                title="Fill in Business Details"
                description="Enter business name, website, time zone, address, and primary contact information."
              />
              <StepItem
                number={4}
                title="Save and Initialize"
                description="Click save to create the subaccount and initialize its workspace."
              />
            </div>

            <InfoBox type="tip">
              <strong>Pro Tip:</strong> Use a clear naming convention like "ClientName - BusinessType" 
              so you can easily identify subaccounts later as your agency grows.
            </InfoBox>
          </ContentSection>
        );

      case "managing-users":
        return (
          <ContentSection>
            <h1>Managing Agency Users</h1>
            <p className="text-xl text-subheading mb-6">
              Control access, assign roles, and manage team members across your agency.
            </p>

            <h2>Available Roles</h2>
            <div className="space-y-4 mb-8">
              <div className="p-4 border border-border-light rounded-lg">
                <h4 className="font-semibold text-heading mb-2">Agency Owner</h4>
                <p className="text-body text-sm">Full control over the entire agency and all subaccounts. Can access billing, create subaccounts, and manage all users.</p>
              </div>
              <div className="p-4 border border-border-light rounded-lg">
                <h4 className="font-semibold text-heading mb-2">Agency Admin</h4>
                <p className="text-body text-sm">Can manage most settings and subaccounts but may have restricted permissions for billing and critical configurations.</p>
              </div>
              <div className="p-4 border border-border-light rounded-lg">
                <h4 className="font-semibold text-heading mb-2">Agency User</h4>
                <p className="text-body text-sm">Limited to assigned subaccounts and specific tasks. Cannot access agency-level settings or create new subaccounts.</p>
              </div>
            </div>

            <h2>Adding New Users</h2>
            <div className="space-y-4 mb-8">
              <StepItem
                number={1}
                title="Go to Agency Users"
                description="Navigate to the user management section in your agency dashboard."
              />
              <StepItem
                number={2}
                title="Click 'Invite User'"
                description="Start the invitation process for a new team member."
              />
              <StepItem
                number={3}
                title="Enter Email and Role"
                description="Provide their email address and select the appropriate role based on their responsibilities."
              />
              <StepItem
                number={4}
                title="Send Invitation"
                description="The user will receive an email invitation to join your agency workspace."
              />
            </div>

            <InfoBox type="warning">
              <strong>Security Note:</strong> Always assign the minimum role necessary for a user's responsibilities. 
              You can always upgrade permissions later as needed.
            </InfoBox>
          </ContentSection>
        );

      case "subaccount-overview":
        return (
          <ContentSection>
            <h1>Subaccount Space Overview</h1>
            <p className="text-xl text-subheading mb-6">
              The Subaccount space is where daily operations happen. Each subaccount provides a complete CRM workspace 
              with its own tools and data, completely separated from other subaccounts.
            </p>

            <h2>Key Features</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <FeatureCard
                icon={MessageSquare}
                title="Conversations"
                description="Centralized messaging hub for SMS, Email, and Social DMs in one place."
              />
              <FeatureCard
                icon={Calendar}
                title="Calendars"
                description="Book appointments, set availability, and send automated reminders."
              />
              <FeatureCard
                icon={Users}
                title="Clients & Leads"
                description="Manage customer profiles, track leads, and monitor sales pipeline."
              />
              <FeatureCard
                icon={BarChart3}
                title="Campaigns"
                description="Create multi-step email/SMS sequences and automate follow-ups."
              />
              <FeatureCard
                icon={FileText}
                title="Forms & Pages"
                description="Build custom forms and landing pages with drag-and-drop tools."
              />
              <FeatureCard
                icon={Settings}
                title="Workflows"
                description="Automate repetitive tasks and create sophisticated business processes."
              />
            </div>

            <InfoBox type="info">
              Each subaccount operates independently, ensuring complete data privacy and allowing 
              you to customize the workspace for each client's specific needs.
            </InfoBox>
          </ContentSection>
        );

      case "main":
        return (
          <ContentSection>
            <h1>Main Dashboard</h1>
            <p className="text-xl text-subheading mb-6">
              Your quick-access hub with shortcuts to the most frequently used modules and features.
            </p>

            <h2>What You'll Find</h2>
            <p>
              The Main section serves as your homepage for the subaccount workspace, providing:
            </p>
            <ul>
              <li>Quick access to essential tools and features</li>
              <li>Recent activity overview</li>
              <li>Shortcuts to commonly used modules</li>
              <li>Important notifications and alerts</li>
            </ul>

            <InfoBox type="tip">
              <strong>Best Practice:</strong> Use the Main dashboard for quick navigation to frequently 
              used features. Avoid cluttering it with rarely used tools to maintain efficiency.
            </InfoBox>
          </ContentSection>
        );

      case "dashboard":
        return (
          <ContentSection>
            <h1>Analytics Dashboard</h1>
            <p className="text-xl text-subheading mb-6">
              Get real-time insights into your business performance with comprehensive analytics and reporting.
            </p>

            <h2>Key Metrics</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="p-4 border border-border-light rounded-lg">
                <h4 className="font-semibold text-heading mb-2">Lead Statistics</h4>
                <p className="text-body text-sm">Track new leads, conversion rates, and lead sources to optimize your acquisition strategy.</p>
              </div>
              <div className="p-4 border border-border-light rounded-lg">
                <h4 className="font-semibold text-heading mb-2">Appointment Bookings</h4>
                <p className="text-body text-sm">Monitor scheduled appointments, no-shows, and booking trends over time.</p>
              </div>
              <div className="p-4 border border-border-light rounded-lg">
                <h4 className="font-semibold text-heading mb-2">Campaign Performance</h4>
                <p className="text-body text-sm">Analyze email open rates, click-through rates, and campaign ROI metrics.</p>
              </div>
              <div className="p-4 border border-border-light rounded-lg">
                <h4 className="font-semibold text-heading mb-2">Pipeline Overview</h4>
                <p className="text-body text-sm">Visualize your sales pipeline and track deals through different stages.</p>
              </div>
            </div>

            <InfoBox type="tip">
              <strong>Pro Tip:</strong> Check your dashboard daily to spot trends early and make 
              data-driven decisions for your business growth.
            </InfoBox>
          </ContentSection>
        );

      default:
        return (
          <ContentSection>
            <h1>Documentation Section</h1>
            <p className="text-xl text-subheading mb-6">
              Select a section from the sidebar to view detailed documentation.
            </p>
            
            <div className="text-center py-12">
              <ArrowRight className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Choose a topic from the navigation menu to get started.</p>
            </div>
          </ContentSection>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8">
        {breadcrumbItems.length > 0 && (
          <div className="mb-6 pb-4 border-b border-border-light animate-fade-in">
            <Breadcrumbs 
              items={breadcrumbItems} 
              onNavigate={onSectionChange}
            />
          </div>
        )}
        
        <div className="animate-fade-in-scale">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
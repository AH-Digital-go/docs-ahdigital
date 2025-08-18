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
import Markdown from 'react-markdown';
import data from "../../../data.json"; // <- JSON import


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


const navigation = data.navigation;

const getBreadcrumbItems = (activeSection: string) => {
  for (const nav of navigation) {
    if (nav.children) {
      for (const child of nav.children) {
        if (child.id === activeSection) {
          return [{ label: nav.title, id: nav.id }];
        }
      }
    }
  }
  return [];
};

export const DocsContent = ({ activeSection, onSectionChange }: DocsContentProps) => {
  const breadcrumbItems = getBreadcrumbItems(activeSection);

  const renderContent = () => {
    let section: any = null;
    outer: for (const nav of navigation) {
      if (nav.id === activeSection) {
        section = nav;
        break;
      }
      if (nav.children) {
        for (const child of nav.children) {
          if (child.id === activeSection) {
            section = child;
            break outer;
          }
        }
      }
    }

    if (!section) {
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

    if (section.children) {
      // Parent section: render children as feature cards
      return (
        <ContentSection>
          <h1>{section.title}</h1>
          <p className="text-xl text-subheading mb-6">
            Explore the subsections of {section.title} below.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {section.children.map((child: any) => (
              <FeatureCard
                key={child.id}
                icon={Star}
                title={child.title}
                description={child.content}
              />
            ))}
          </div>
          <InfoBox type="tip">
            Click on a subsection card or use the sidebar to dive deeper into each topic.
          </InfoBox>
        </ContentSection>
      );
    } else {
      // Leaf section: render content as markdown
      return (
        <ContentSection  >
          <style >{`
      

      .prose p, ul, ol, hr{
        padding:0.9rem 0;
        color: rgba(121, 117, 117, 1);
        line-height: 1.5rem;
        list-style: circle;
      }

     
    `}</style>
          <h1>{section.title}</h1>
          <Markdown>
            {section.content}
          </Markdown>
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
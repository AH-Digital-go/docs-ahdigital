import { ReactNode } from "react";
import { 
  HelpCircle,
  Shield,
  Lightbulb,
  ArrowRight,
  Star
} from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import Markdown from 'react-markdown';
import data from "../../../data.json"; // <- matches your MVP JSON


interface DocsContentProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const ContentSection = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`prose prose-slate max-w-none animate-fade-in ${className}`}>
    {children}
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }: { 
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) => (
  <div className="group p-6 bg-gradient-card border border-border-light rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h4 className="font-semibold text-heading">{title}</h4>
    </div>
    <p className="text-sm text-body">{description}</p>
  </div>
);

const StepItem = ({ number, text, image }: { 
  number: number;
  text: string;
  image?: string;
}) => (
  <div className="group flex gap-4 p-6 bg-gradient-subtle rounded-xl border border-border-light hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
    <div className="flex-shrink-0 w-10 h-10 bg-gradient-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm shadow-md">
      {number}
    </div>
    <div className="flex-1">
      <p className="text-body text-sm leading-relaxed">{text}</p>
      {image && <img src={image} alt={text} className="mt-2 rounded-lg border" />}
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


const sections = data.sections;

const getBreadcrumbItems = (activeSection: string) => {
  const section = sections.find((s: any) => s.id === activeSection);
  return section ? [{ label: section.title, id: section.id }] : [];
};

export const DocsContent = ({ activeSection, onSectionChange }: DocsContentProps) => {
  const breadcrumbItems = getBreadcrumbItems(activeSection);
  const section: any = sections.find((s: any) => s.id === activeSection);

  const renderContent = () => {
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

    return (
      <ContentSection>
        <h1>{section.title}</h1>
        {section.description && (
          <p className="text-xl text-subheading mb-6">{section.description}</p>
        )}

        {/* Features */}
        {section.features && (
          <>
            <h2>Features</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {section.features.map((f: string, i: number) => (
                <FeatureCard key={i} icon={Star} title={f} description="" />
              ))}
            </div>
          </>
        )}

        {/* Benefits */}
        {section.benefits && (
          <>
            <h2>Benefits</h2>
            <ul className="list-disc pl-6">
              {section.benefits.map((b: string, i: number) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </>
        )}

        {/* Examples */}
        {section.examples && (
          <>
            <h2>Examples</h2>
            <ul className="list-disc pl-6">
              {section.examples.map((ex: string, i: number) => (
                <li key={i}>{ex}</li>
              ))}
            </ul>
          </>
        )}

        {/* Steps */}
        {section.steps && (
          <>
            <h2>Steps</h2>
            <div className="space-y-4">
              {section.steps.map((s: any, i: number) => (
                <StepItem key={i} number={i + 1} text={s.text} image={s.image} />
              ))}
            </div>
          </>
        )}
      </ContentSection>
    );
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
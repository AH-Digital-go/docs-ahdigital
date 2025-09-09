import { ReactNode, useState } from "react";
import { 
  HelpCircle,
  Shield,
  Lightbulb,
  ArrowRight,
  Star,
  MessageCircle
} from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import Markdown from 'react-markdown';
import data from "../../../data.json";
import DocsChat from "./DocsChat";

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
  <div className=" group p-2 bg-gradient-card border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
    <div className="flex items-center gap-3 ">
      <div className="p-2 rounded-lg bg-blue-600/10">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
    </div>
    <p className="text-xs text-gray-600">{description}</p>
  </div>
);

const StepItem = ({ number, text, image }: { 
  number: number;
  text: string;
  image?: string;
}) => (
  <div className="group flex gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-md">
      {number}
    </div>
    <div className="flex-1">
      <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
      {image && <img src={image} alt={text} className="mt-2 rounded-lg border border-gray-200" />}
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
  const [isChatOpen, setIsChatOpen] = useState(false);

  const renderContent = () => {
    if (!section) {
      return (
        <ContentSection>
  <h1>{data.title}</h1>
  <p className="text-xl text-gray-600 mb-6">{data.subtitle}</p>
  <div className="text-left py-12 space-y-8">
    <p>
      Welcome to <strong>AH Digital 🚀</strong>
      <br />
      <br />
      Your all-in-one platform designed to help agencies, teams, and businesses
      <strong> streamline operations, connect with customers, and grow smarter</strong>.  
      Whether you’re managing leads, running campaigns, or building client
      experiences, our tools are built to save you time, reduce complexity, and
      unlock growth.
    </p>

    <div>
      <h3 className="text-2xl font-semibold mb-4">🌟 What We Offer</h3>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <strong>Centralized Workspace</strong> — Manage agencies, subaccounts,
          users, and permissions in a single, secure environment.
        </li>
        <li>
          <strong>Conversations Hub</strong> — Keep all client communications
          (WhatsApp, SMS, email, and more) in one place — no more switching tabs.
        </li>
        <li>
          <strong>Calendars & Bookings</strong> — Simplify scheduling with smart
          calendars, appointment tracking, and automated reminders.
        </li>
        <li>
          <strong>Reputation Management</strong> — Collect reviews, monitor
          feedback, and showcase trust where it matters most.
        </li>
        <li>
          <strong>Landing Pages & Funnels</strong> — Drag-and-drop builder to
          launch high-converting landing pages, capture leads, and guide them
          through funnels.
        </li>
        <li>
          <strong>Forms & Surveys</strong> — Create custom forms to capture data,
          qualify leads, and run interactive campaigns.
        </li>
        <li>
          <strong>Workflows & Automations</strong> — Automate repetitive tasks
          with visual workflows — focus on growth, not manual busywork.
        </li>
        <li>
          <strong>Email Campaigns</strong> — Build, schedule, and track engaging
          campaigns with detailed analytics.
        </li>
        <li>
          <strong>Knowledge Base & AI Chatbot</strong> — Offer 24/7 support with
          self-service knowledge articles and AI-powered chat.
        </li>
      </ul>
    </div>

    <div>
      <h3 className="text-2xl font-semibold mb-4">💡 Why Choose AH Digital?</h3>
      <ul className="list-disc list-inside space-y-2">
        <li>Scales with you — from solo entrepreneurs to large agencies.</li>
        <li>All-in-one solution — reduce costs and tool overload.</li>
        <li>Collaboration-friendly — roles, permissions, and shared workspaces.</li>
        <li>Data-driven decisions — built-in tracking, analytics, and reporting.</li>
        <li>Secure and reliable — enterprise-grade security at every layer.</li>
      </ul>
    </div>

    <div>
      <h3 className="text-2xl font-semibold mb-4">🚀 Next Steps</h3>
      <p>
        Get started with our <a href="#" className="text-blue-600 underline">Quick Start Guide</a>.
      </p>
    </div>
  </div>
</ContentSection>

      );
    }

    return (
      <ContentSection>
        <h1 className="text-md ">{section.title}</h1>
        {section.description && (
          <p className="text-md text-gray-600 mb-6">{section.description}</p>
        )}

        {section.features && (
          <div className="mb-8 mt-4">
            <h2>Features</h2>
            <div className="grid md:grid-cols-2 gap-6 my-8">
              {section.features.map((f: string, i: number) => (
                <FeatureCard key={i} icon={Star} title={f} description="" />
              ))}
            </div>
          </div>
        )}

        {section.benefits && (
          <div className="mb-8 mt-4">
            <h2 className="my-2">Benefits</h2>
            <ul className="list-disc pl-6">
              {section.benefits.map((b: string, i: number) => (
                <li key={i} className="text-gray-600">{b}</li>
              ))}
            </ul>
          </div>
        )}

        {section.examples && (
          <div className="mb-8 mt-4">
            <h2 className="my-2">Examples</h2>
            <ul className="list-disc pl-6">
              {section.examples.map((ex: string, i: number) => (
                <li key={i} className="text-gray-600">{ex}</li>
              ))}
            </ul>
          </div>
        )}

        {section.steps && (
          <div className="my-8">
            <h2>Steps</h2>
            <div className="space-y-4 mt-4">
              {section.steps.map((s: any, i: number) => (
                <StepItem key={i} number={i + 1} text={s.text} image={s.image} />
              ))}
            </div>
          </div>
        )}
      </ContentSection>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8">
        {breadcrumbItems.length > 0 && (
          <div className="mb-6 pb-4 border-b border-gray-200 animate-fade-in">
            <Breadcrumbs 
              items={breadcrumbItems} 
              onNavigate={onSectionChange}
            />
          </div>
        )}
        <div className="animate-fade-in-scale">
          {renderContent()}
        </div>
        {/* Chat Toggle Button */}
        <button
          className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse-subtle"
          onClick={() => setIsChatOpen(!isChatOpen)}
          title={isChatOpen ? "Close Chat" : "Open Chat"}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
        {/* Chat Window */}
        {isChatOpen && (
          <div className="fixed bottom-8 right-8 z-50 animate-slide-in-right">
            <DocsChat onClose={() => setIsChatOpen(false)} />
          </div>
        )}
      </div>
    </div>
  );
};
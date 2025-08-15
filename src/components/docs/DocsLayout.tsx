import { useState } from "react";
import { DocsSidebar } from "./DocsSidebar";
import { DocsContent } from "./DocsContent";

export const DocsLayout = () => {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="min-h-screen bg-background flex">
      <DocsSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <DocsContent activeSection={activeSection} />
    </div>
  );
};
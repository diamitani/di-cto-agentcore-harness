"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { Nav } from "./nav";
import { Sidebar } from "./sidebar";

export interface ThreadItem {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp?: string;
}

export function DashboardLayout({
  children,
  threads = [],
  onNewThread,
}: {
  children: React.ReactNode;
  threads?: ThreadItem[];
  onNewThread?: () => void;
}) {
  const [activeSection, setActiveSection] = useState("chat");
  const [activeThread, setActiveThread] = useState<string>();

  const handleThreadSelect = useCallback((id: string) => {
    setActiveThread(id);
  }, []);

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-emerald-500/4 blur-[100px]" />
      </div>

      <Nav activeSection={activeSection} onSectionChange={setActiveSection} />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="relative z-10 flex flex-1 overflow-hidden pt-20"
      >
        <Sidebar
          threads={threads}
          activeThread={activeThread}
          onThreadSelect={handleThreadSelect}
          onNewThread={onNewThread}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      </motion.main>
    </div>
  );
}

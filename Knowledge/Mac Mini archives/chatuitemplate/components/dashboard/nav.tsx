"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Chat, Gear, Code, Graph } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "chat", label: "Chat", icon: Chat },
  { id: "dashboard", label: "Dashboard", icon: Graph },
  { id: "tools", label: "Tools", icon: Code },
  { id: "settings", label: "Settings", icon: Gear },
];

export function Nav({ activeSection = "chat", onSectionChange, className }: {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 }}
        className={cn(
          "fixed top-4 left-1/2 z-50 -translate-x-1/2",
          className,
        )}
      >
        <div className="glass-panel-heavy rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.3)] shadow-black/40">
          <div className="flex items-center gap-0.5 p-1.5">
            <div className="mr-3 flex items-center gap-2 pl-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15">
                <div className="h-2.5 w-2.5 rounded-sm bg-primary shadow-[0_0_8px_var(--primary)]" />
              </div>
              <span className="text-[13px] font-semibold tracking-tight text-foreground/90">
                Hermes
              </span>
            </div>

            <div className="mx-2 h-5 w-px bg-border/60" />

            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange?.(item.id)}
                  className={cn(
                    "relative flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-300",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground/80",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-primary/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon
                    weight={isActive ? "fill" : "regular"}
                    className="relative h-4 w-4"
                  />
                  <span className="relative hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {expanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xl"
              onClick={() => setExpanded(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
              className="fixed inset-x-4 top-20 z-50 mx-auto max-w-lg rounded-2xl border border-white/10 bg-black/90 p-8 backdrop-blur-3xl"
            >
              <nav className="flex flex-col gap-3">
                {navItems.map((item, i) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{
                      delay: i * 0.06,
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1] as const,
                    }}
                    onClick={() => {
                      onSectionChange?.(item.id);
                      setExpanded(false);
                    }}
                    className={cn(
                      "rounded-xl px-4 py-3 text-left text-lg font-medium transition-colors duration-300",
                      activeSection === item.id
                        ? "bg-primary/10 text-primary"
                        : "text-white/70 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

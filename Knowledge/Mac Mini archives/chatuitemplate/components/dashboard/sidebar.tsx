"use client";

import { motion } from "motion/react";
import { Plus, ChatCircle, Trash } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ThreadItem {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp?: string;
}

export function Sidebar({
  threads = [],
  activeThread,
  onThreadSelect,
  onNewThread,
  className,
}: {
  threads?: ThreadItem[];
  activeThread?: string;
  onThreadSelect?: (id: string) => void;
  onNewThread?: () => void;
  className?: string;
}) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className={cn(
        "flex h-full w-[280px] shrink-0 flex-col border-r border-white/5 bg-black/20",
        className,
      )}
    >
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Conversations
        </h2>
        <button
          onClick={onNewThread}
          className="group flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
        >
          <Plus
            weight="regular"
            className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-90"
          />
        </button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="flex flex-col gap-1 pb-4">
          {threads.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-4 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02]">
                <ChatCircle
                  weight="light"
                  className="h-5 w-5 text-muted-foreground/40"
                />
              </div>
              <p className="text-[13px] leading-relaxed text-muted-foreground/50">
                No conversations yet.
                <br />
                Start a new chat.
              </p>
            </div>
          ) : (
            threads.map((thread) => {
              const isActive = thread.id === activeThread;
              return (
                <motion.button
                  key={thread.id}
                  onClick={() => onThreadSelect?.(thread.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "group relative flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-all duration-300",
                    isActive
                      ? "bg-white/[0.06]"
                      : "hover:bg-white/[0.03]",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="thread-active"
                      className="absolute inset-0 rounded-xl border border-white/8 bg-white/[0.04]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <div className="relative mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    <ChatCircle
                      weight={isActive ? "fill" : "light"}
                      className={cn(
                        "h-3.5 w-3.5 transition-colors duration-300",
                        isActive ? "text-primary" : "text-muted-foreground/50 group-hover:text-muted-foreground/70",
                      )}
                    />
                  </div>
                  <div className="relative min-w-0 flex-1">
                    <p
                      className={cn(
                        "truncate text-[13px] font-medium transition-colors duration-300",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground/70 group-hover:text-foreground/80",
                      )}
                    >
                      {thread.title}
                    </p>
                    {thread.lastMessage && (
                      <p className="mt-0.5 truncate text-[11px] leading-relaxed text-muted-foreground/40">
                        {thread.lastMessage}
                      </p>
                    )}
                  </div>
                </motion.button>
              );
            })
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-white/5 px-5 py-4">
        <p className="text-[11px] leading-relaxed text-muted-foreground/30">
          Hermes Agent Template
          <br />
          Assistant Transport
        </p>
      </div>
    </motion.aside>
  );
}

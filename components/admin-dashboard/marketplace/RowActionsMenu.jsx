import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, Eye, Pencil, Copy, PauseCircle, Archive, Trash2, PlayCircle } from "lucide-react";

export default function RowActionsMenu({ campaign, onView, onEdit, onDuplicate, onPauseToggle, onArchive, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isPaused = campaign.status === "paused";

  const items = [
    { label: "View", icon: Eye, action: onView },
    { label: "Edit", icon: Pencil, action: onEdit },
    { label: "Duplicate", icon: Copy, action: onDuplicate },
    { label: isPaused ? "Resume" : "Pause", icon: isPaused ? PlayCircle : PauseCircle, action: onPauseToggle },
    { label: "Archive", icon: Archive, action: onArchive },
    { label: "Delete", icon: Trash2, action: onDelete, danger: true },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
      >
        <MoreVertical size={15} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 mt-1 w-44 rounded-xl bg-card border border-border shadow-2xl z-30 overflow-hidden py-1"
          >
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setOpen(false);
                  item.action?.(campaign);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium transition-colors ${
                  item.danger ? "text-red-500 hover:bg-red-500/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon size={13} /> {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

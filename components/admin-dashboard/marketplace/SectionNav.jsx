import React from "react";
import clsx from "clsx";

export default function SectionNav({ sections, active }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sticky top-20 space-y-1">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          className={clsx(
            "w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors",
            active === s.id ? "bg-purple-500/10 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <s.icon size={14} />
          {s.label}
        </button>
      ))}
    </div>
  );
}

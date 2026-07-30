import React from "react";
import { Card } from "@/components/ui/card";

export default function FormSection({ id, title, subtitle, icon: Icon, children }) {
  return (
    <Card id={id} className="scroll-mt-24 bg-card border-border">
      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border px-4">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
            <Icon size={18} />
          </div>
        )}
        <div>
          <h3 className="font-display font-bold text-base text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </Card>
  );
}

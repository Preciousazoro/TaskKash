import React, { useState } from "react";
import { Monitor, Tablet, Smartphone, Coins, Users, Clock, BadgeCheck } from "lucide-react";
import clsx from "clsx";

const DEVICE_WIDTHS = { desktop: "100%", tablet: "420px", mobile: "300px" };

export default function CampaignPreview({ form }) {
  const [device, setDevice] = useState("desktop");

  return (
    <div>
      <div className="px-4 flex items-center justify-center gap-1.5 mb-5 bg-muted/30 border border-border rounded-xl p-1 w-fit mx-auto">
        {[
          { id: "desktop", icon: Monitor },
          { id: "tablet", icon: Tablet },
          { id: "mobile", icon: Smartphone },
        ].map((d) => (
          <button
            key={d.id}
            onClick={() => setDevice(d.id)}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors",
              device === d.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <d.icon size={13} /> {d.id.charAt(0).toUpperCase() + d.id.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex justify-center bg-black/30 rounded-2xl p-6 overflow-x-auto">
        <div style={{ width: DEVICE_WIDTHS[device], maxWidth: "100%" }} className="transition-all duration-300">
          <div className="rounded-2xl overflow-hidden border border-border bg-card">
            <div className="relative h-32 bg-gradient-to-br from-purple-500/30 to-blue-500/20 overflow-hidden">
              {form.banner ? (
                <div className="w-full h-full bg-muted/20 flex items-center justify-center text-xs text-muted-foreground">Banner: {form.banner}</div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No banner uploaded</div>
              )}
              <div className="absolute top-2.5 left-2.5">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-500/15 text-green-500 border border-green-500/30">
                  {form.visibility === "published" ? "Live" : "Draft Preview"}
                </span>
              </div>
              <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-lg bg-black/50 backdrop-blur flex items-center justify-center text-sm">
                {form.brandLogo || "🏷️"}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1.5">
                <span className="font-medium text-foreground">{form.brandName || "Brand Name"}</span>
                <BadgeCheck size={12} className="text-blue-500" />
              </div>
              <h4 className="font-bold text-sm leading-snug mb-2 line-clamp-2 min-h-[2.4rem] text-foreground">
                {form.name || "Campaign name will appear here"}
              </h4>
              <p className="text-[11px] text-muted-foreground mb-3 line-clamp-2 min-h-[1.8rem]">
                {form.shortDescription || "Short description will appear here"}
              </p>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-green-500">
                  <Coins size={12} /> {form.rewardAmount || "0"} TP
                </span>
                <span className="text-[10px] text-muted-foreground uppercase">{form.category || "Category"}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2.5 border-t border-border">
                <span className="flex items-center gap-1"><Users size={10} /> 0</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {form.endsAt || "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

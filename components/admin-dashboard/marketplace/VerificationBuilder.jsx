import React from "react";
import { Plus, Trash2, Zap, ShieldCheck } from "lucide-react";
import { VERIFICATION_FIELD_TYPES, VERIFICATION_MODES } from "../data/constants";
import { Field, TextInput, Select, Toggle } from "../ui/FormControls";
import { Button } from "@/components/ui/button";

let uid = 0;
const newId = () => `vf_${Date.now()}_${uid++}`;

export function emptyField() {
  return { id: newId(), type: "wallet", label: "", required: true };
}

export default function VerificationBuilder({ mode, setMode, fields, setFields }) {
  const update = (updated) => setFields((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  const remove = (id) => setFields((prev) => prev.filter((f) => f.id !== id));
  const add = () => setFields((prev) => [...prev, emptyField()]);

  return (
    <div className="space-y-6">
      <div className="px-4">
        <span className="text-xs font-semibold text-muted-foreground mb-2 block">Verification Mode</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {VERIFICATION_MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`text-left p-4 rounded-xl border transition-colors ${
                mode === m.id 
                  ? "border-purple-500 bg-purple-500/10" 
                  : "border-border bg-muted/20 hover:border-border hover:bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                {m.id === "instant" ? <Zap size={14} className="text-green-500" /> : <ShieldCheck size={14} className="text-purple-500" />}
                <span className="text-sm font-semibold text-foreground">{m.label}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{m.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {mode !== "instant" && (
        <div className="px-4">
          <span className="text-xs font-semibold text-muted-foreground mb-2 block">Proof Fields</span>
          <div className="space-y-2.5">
            {fields.map((f) => {
              const meta = VERIFICATION_FIELD_TYPES.find((t) => t.id === f.type);
              const Icon = meta?.icon;
              return (
                <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20">
                  {Icon && (
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                      <Icon size={14} />
                    </div>
                  )}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Select
                      value={f.type}
                      onChange={(v) => update({ ...f, type: v })}
                      options={VERIFICATION_FIELD_TYPES.map((t) => ({ value: t.id, label: t.label }))}
                    />
                    <TextInput
                      value={f.label}
                      onChange={(e) => update({ ...f, label: e.target.value })}
                      placeholder="Custom field label (optional)"
                    />
                  </div>
                  <Toggle checked={f.required} onChange={(v) => update({ ...f, required: v })} />
                  <button onClick={() => remove(f.id)} className="text-muted-foreground hover:text-red-500 transition-colors shrink-0">
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}
          </div>
          <Button variant="outline" onClick={add} className="mt-3.5 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Proof Field
          </Button>
        </div>
      )}

      {mode === "instant" && (
        <div className="px-4 text-center py-6 border border-dashed border-border rounded-xl">
          <Zap size={20} className="text-green-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Instant campaigns verify automatically — no proof fields needed.</p>
        </div>
      )}
    </div>
  );
}

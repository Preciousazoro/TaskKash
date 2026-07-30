import React, { useState } from "react";
import { Reorder, motion } from "framer-motion";
import { Plus, GripVertical, Trash2, ChevronDown } from "lucide-react";
import { REQUIREMENT_TYPES } from "../data/constants";
import { Field, TextInput, Select, Toggle } from "../ui/FormControls";
import { Button } from "@/components/ui/button";

let uid = 0;
const newId = () => `req_${Date.now()}_${uid++}`;

export function emptyRequirement() {
  return {
    id: newId(),
    type: "purchase",
    description: "",
    minAmount: "",
    minHoldDays: "",
    required: true,
    customRule: "",
  };
}

function RequirementCard({ req, onChange, onRemove }) {
  const [expanded, setExpanded] = useState(true);
  const meta = REQUIREMENT_TYPES.find((t) => t.id === req.type) || REQUIREMENT_TYPES[0];
  const Icon = meta.icon;
  const needsHold = req.type === "hold_token" || req.type === "stake" || req.type === "subscribe";
  const needsAmount = ["buy_token", "hold_token", "stake", "deposit", "purchase"].includes(req.type);

  return (
    <Reorder.Item
      value={req}
      id={req.id}
      className="rounded-xl border border-border bg-muted/20 overflow-hidden"
      whileDrag={{ scale: 1.02, boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}
    >
      <div className="flex items-center gap-3 p-3.5">
        <GripVertical size={15} className="text-muted-foreground cursor-grab active:cursor-grabbing shrink-0" />
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
          <Icon size={14} />
        </div>
        <button onClick={() => setExpanded((v) => !v)} className="flex-1 text-left min-w-0">
          <div className="text-sm font-medium truncate text-foreground">{req.description || meta.label}</div>
          <div className="text-[11px] text-muted-foreground">{meta.label}</div>
        </button>
        <Toggle checked={req.required} onChange={(v) => onChange({ ...req, required: v })} />
        <button onClick={() => setExpanded((v) => !v)} className="text-muted-foreground hover:text-foreground">
          <ChevronDown size={15} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
        <button onClick={() => onRemove(req.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
          <Trash2 size={15} />
        </button>
      </div>

      {expanded && (
        <div className="px-3.5 pb-4 pt-1 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Requirement Type" className="sm:col-span-2">
            <Select
              value={req.type}
              onChange={(v) => onChange({ ...req, type: v })}
              options={REQUIREMENT_TYPES.map((t) => ({ value: t.id, label: t.label }))}
            />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <TextInput
              value={req.description}
              onChange={(e) => onChange({ ...req, description: e.target.value })}
              placeholder="e.g. Buy a minimum of 50 SLND tokens"
            />
          </Field>
          {needsAmount && (
            <Field label="Minimum Amount">
              <TextInput
                type="number"
                value={req.minAmount}
                onChange={(e) => onChange({ ...req, minAmount: e.target.value })}
                placeholder="e.g. 50"
              />
            </Field>
          )}
          {needsHold && (
            <Field label="Minimum Hold Days">
              <TextInput
                type="number"
                value={req.minHoldDays}
                onChange={(e) => onChange({ ...req, minHoldDays: e.target.value })}
                placeholder="e.g. 30"
              />
            </Field>
          )}
          {req.type === "custom" && (
            <Field label="Custom Rule" className="sm:col-span-2">
              <TextInput
                value={req.customRule}
                onChange={(e) => onChange({ ...req, customRule: e.target.value })}
                placeholder="Describe the custom rule logic"
              />
            </Field>
          )}
        </div>
      )}
    </Reorder.Item>
  );
}

export default function RequirementsBuilder({ requirements, setRequirements }) {
  const update = (updated) => setRequirements((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  const remove = (id) => setRequirements((prev) => prev.filter((r) => r.id !== id));
  const add = () => setRequirements((prev) => [...prev, emptyRequirement()]);

  return (
    <div className="px-4">
      {requirements.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-border rounded-xl">
          <p className="text-sm text-muted-foreground mb-3">No requirements added yet.</p>
        </div>
      ) : (
        <Reorder.Group axis="y" values={requirements} onReorder={setRequirements} className="space-y-2.5">
          {requirements.map((req) => (
            <RequirementCard key={req.id} req={req} onChange={update} onRemove={remove} />
          ))}
        </Reorder.Group>
      )}
      <Button variant="outline" onClick={add} className="mt-3.5 w-full sm:w-auto">
        <Plus className="w-4 h-4 mr-2" />
        Add Requirement
      </Button>
    </div>
  );
}

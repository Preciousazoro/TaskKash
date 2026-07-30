import React, { useState } from "react";
import { Reorder } from "framer-motion";
import { Plus, GripVertical, Trash2, Copy, ChevronDown, Image, Video, Link2 } from "lucide-react";
import { Field, TextInput, TextArea } from "../ui/FormControls";
import { Button } from "@/components/ui/button";

let uid = 0;
const newId = () => `step_${Date.now()}_${uid++}`;

export function emptyStep() {
  return { id: newId(), title: "", description: "", image: "", video: "", link: "" };
}

function StepCard({ step, index, onChange, onRemove, onDuplicate }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <Reorder.Item
      value={step}
      id={step.id}
      className="rounded-xl border border-border bg-muted/20 overflow-hidden"
      whileDrag={{ scale: 1.02, boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}
    >
      <div className="flex items-center gap-3 p-3.5">
        <GripVertical size={15} className="text-muted-foreground cursor-grab active:cursor-grabbing shrink-0" />
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white"
          style={{ background: "linear-gradient(135deg, #8B5CF6, #3B82F6)" }}
        >
          {index + 1}
        </div>
        <button onClick={() => setExpanded((v) => !v)} className="flex-1 text-left min-w-0">
          <div className="text-sm font-medium truncate text-foreground">{step.title || `Step ${index + 1}`}</div>
        </button>
        <button onClick={() => onDuplicate(step)} className="text-muted-foreground hover:text-foreground transition-colors">
          <Copy size={14} />
        </button>
        <button onClick={() => setExpanded((v) => !v)} className="text-muted-foreground hover:text-foreground">
          <ChevronDown size={15} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
        <button onClick={() => onRemove(step.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
          <Trash2 size={15} />
        </button>
      </div>

      {expanded && (
        <div className="px-3.5 pb-4 pt-1 border-t border-border/60 space-y-3">
          <Field label="Step Title">
            <TextInput value={step.title} onChange={(e) => onChange({ ...step, title: e.target.value })} placeholder="e.g. Connect your wallet" />
          </Field>
          <Field label="Description">
            <TextArea rows={2} value={step.description} onChange={(e) => onChange({ ...step, description: e.target.value })} placeholder="Explain what the user needs to do" />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Image URL">
              <div className="relative">
                <Image size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <TextInput className="pl-8" value={step.image} onChange={(e) => onChange({ ...step, image: e.target.value })} placeholder="Optional" />
              </div>
            </Field>
            <Field label="Video URL">
              <div className="relative">
                <Video size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <TextInput className="pl-8" value={step.video} onChange={(e) => onChange({ ...step, video: e.target.value })} placeholder="Optional" />
              </div>
            </Field>
            <Field label="External Link">
              <div className="relative">
                <Link2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <TextInput className="pl-8" value={step.link} onChange={(e) => onChange({ ...step, link: e.target.value })} placeholder="Optional" />
              </div>
            </Field>
          </div>
        </div>
      )}
    </Reorder.Item>
  );
}

export default function InstructionsBuilder({ steps, setSteps }) {
  const update = (updated) => setSteps((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  const remove = (id) => setSteps((prev) => prev.filter((s) => s.id !== id));
  const duplicate = (step) => setSteps((prev) => [...prev, { ...step, id: newId(), title: `${step.title} (Copy)` }]);
  const add = () => setSteps((prev) => [...prev, emptyStep()]);

  return (
    <div className="px-4">
      {steps.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-border rounded-xl">
          <p className="text-sm text-muted-foreground mb-3">No instruction steps yet.</p>
        </div>
      ) : (
        <Reorder.Group axis="y" values={steps} onReorder={setSteps} className="space-y-2.5">
          {steps.map((step, i) => (
            <StepCard key={step.id} step={step} index={i} onChange={update} onRemove={remove} onDuplicate={duplicate} />
          ))}
        </Reorder.Group>
      )}
      <Button variant="outline" onClick={add} className="mt-3.5 w-full sm:w-auto">
        <Plus className="w-4 h-4 mr-2" />
        Add Step
      </Button>
    </div>
  );
}

import React from "react";
import { Reorder } from "framer-motion";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import { TextInput, TextArea } from "../ui/FormControls";
import { Button } from "@/components/ui/button";

let uid = 0;
const newId = () => `faq_${Date.now()}_${uid++}`;

export function emptyFaq() {
  return { id: newId(), question: "", answer: "" };
}

export default function FAQBuilder({ faqs, setFaqs }) {
  const update = (updated) => setFaqs((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  const remove = (id) => setFaqs((prev) => prev.filter((f) => f.id !== id));
  const add = () => setFaqs((prev) => [...prev, emptyFaq()]);

  return (
    <div>
      {faqs.length === 0 ? (
        <div className="px-4 text-center py-8 border border-dashed border-border rounded-xl">
          <p className="text-sm text-muted-foreground mb-3">No FAQs added yet.</p>
        </div>
      ) : (
        <div className="px-4">
          <Reorder.Group axis="y" values={faqs} onReorder={setFaqs} className="space-y-2.5">
            {faqs.map((f) => (
              <Reorder.Item
                key={f.id}
                value={f}
                id={f.id}
                className="rounded-xl border border-border bg-muted/20 p-3.5"
                whileDrag={{ scale: 1.02, boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}
              >
                <div className="flex items-start gap-3">
                  <GripVertical size={15} className="text-muted-foreground cursor-grab active:cursor-grabbing shrink-0 mt-2.5" />
                  <div className="flex-1 space-y-2.5">
                    <TextInput value={f.question} onChange={(e) => update({ ...f, question: e.target.value })} placeholder="Question" />
                    <TextArea rows={2} value={f.answer} onChange={(e) => update({ ...f, answer: e.target.value })} placeholder="Answer" />
                  </div>
                  <button onClick={() => remove(f.id)} className="text-muted-foreground hover:text-red-500 transition-colors shrink-0 mt-2.5">
                    <Trash2 size={15} />
                  </button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      )}
      <div className="px-4">
        <Button variant="outline" onClick={add} className="mt-3.5 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ
        </Button>
      </div>
    </div>
  );
}
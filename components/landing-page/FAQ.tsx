"use client";

import { useState } from "react";
import { Montserrat } from "next/font/google";
import { Plus, X } from "lucide-react";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const faqs = [
  {
    question: "How do I start earning on TaskKash?",
    answer:
      "Getting started is simple: connect your Solana wallet, browse available tasks from various brands, complete the required actions (like social media engagement or content creation), submit proof of completion, and earn Task Points (TP) once verified.",
  },
  {
    question: "What are Task Points and how do they work?",
    answer:
      "Task Points (TP) are the native reward units on TaskKash. You earn TP for completing verified tasks, which can then be converted to SOL based on current platform rates. The more tasks you complete, the more TP you accumulate and convert.",
  },
  {
    question: "How do I convert my Task Points to SOL?",
    answer:
      "Once you've accumulated TP, you can convert them to SOL through your dashboard. The conversion rate is transparent and displayed in real-time. SOL withdrawals are processed directly to your connected wallet.",
  },
  {
    question: "What types of tasks are available on TaskKash?",
    answer:
      "Tasks range from social media engagement (following, liking, sharing), content creation (posts, videos, reviews), commerce activities (product testing, reviews), to community participation. Each task clearly shows the TP reward and requirements.",
  },
  {
    question: "How does TaskKash verify task completion?",
    answer:
      "Our verification system requires users to submit proof of completion (screenshots, links, or other evidence). Our admin team reviews submissions to ensure authenticity before awarding TP. This maintains quality and fairness for both users and brands.",
  },
  {
    question: "Can brands track their campaign performance?",
    answer:
      "Yes. Brands get access to a comprehensive dashboard showing real-time analytics including participation rates, completion rates, engagement metrics, and ROI data. Campaign performance is fully transparent and measurable.",
  },
  {
    question: "Is there a minimum amount to withdraw SOL?",
    answer:
      "Yes, there's a minimum withdrawal threshold to ensure efficient blockchain transactions. The current minimum is displayed in your wallet section. We recommend accumulating TP before conversion to minimize transaction fees.",
  },
  {
    question: "How does TaskKash ensure security for users and brands?",
    answer:
      "We use Solana's secure blockchain infrastructure, implement wallet connection standards, and have a robust verification system. All transactions are transparent on-chain, and we maintain strict data protection policies for user information.",
  },
];

function FAQItem({
  faq,
  isOpen,
  onClick,
}: {
  faq: any;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`group transition-all duration-300 rounded-[1rem] border ${
        isOpen
          ? "bg-card border-emerald-500/50"
          : "bg-secondary/30 border-border hover:border-emerald-500/30 dark:hover:border-emerald-400/30"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center cursor-pointer justify-between p-6 text-left"
      >
        <span
          className={`text-sm md:text-sm font-bold uppercase tracking-tight ${
            isOpen ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
          }`}
        >
          {faq.question}
        </span>
        <div className="flex-shrink-0 ml-4 transition-transform duration-300">
          {isOpen ? (
            <X className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Plus className="w-5 h-5 text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-8">
          <div className="h-px bg-emerald-500/10 dark:bg-emerald-400/10 mb-6" />
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-[1400px] px-4 lg:px-8 py-20 w-full">
      <div className="text-center mb-10 relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-[.2em] mb-4 text-emerald-600 dark:text-emerald-400">
          Support
        </div>

        {/* Main Heading */}
        <h2
          className={`${montserrat.className} text-3xl md:text-5xl lg:text-4xl font-black leading-[1.1] tracking-tight text-foreground mb-6 uppercase`}
        >
          Frequently Asked Questions
        </h2>

        {/* Centered Paragraph */}
        <p className="text-muted-foreground max-w-lg mx-auto text-base md:text-lg font-semi leading-relaxed">
          Everything you need to know about the TaskKash ecosystem. From
          earning Task Points to converting them into SOL.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Left Column */}
        <div className="space-y-4">
          {faqs.slice(0, 4).map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openFaq === index}
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
            />
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {faqs.slice(4, 8).map((faq, index) => (
            <FAQItem
              key={index + 4}
              faq={faq}
              isOpen={openFaq === index + 4}
              onClick={() =>
                setOpenFaq(openFaq === index + 4 ? null : index + 4)
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
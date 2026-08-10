import React from "react";
import { Field, Select, Toggle, TextArea } from "../ui/FormControls.tsx";

const COUNTRIES = [
  { value: "all", label: "All Countries" },
  { value: "nigeria", label: "Nigeria" },
  { value: "ghana", label: "Ghana" },
  { value: "kenya", label: "Kenya" },
  { value: "south_africa", label: "South Africa" },
  { value: "united_states", label: "United States" },
  { value: "united_kingdom", label: "United Kingdom" }
];
const LANGUAGES = [
  { value: "all", label: "All Languages" },
  { value: "english", label: "English" },
  { value: "french", label: "French" },
  { value: "portuguese", label: "Portuguese" },
  { value: "swahili", label: "Swahili" }
];
const WALLET_TYPES = [
  { value: "any", label: "Any Wallet" },
  { value: "phantom", label: "Phantom" },
  { value: "solflare", label: "Solflare" },
  { value: "trust_wallet", label: "Trust Wallet" },
  { value: "backpack", label: "Backpack" }
];
const USER_LEVELS = [
  { value: "1", label: "Level 1" },
  { value: "2", label: "Level 2" },
  { value: "3", label: "Level 3" },
  { value: "4", label: "Level 4" },
  { value: "5", label: "Level 5" }
];

export default function AudienceTargeting({ audience, setAudience }) {
  const update = (key, value) => setAudience((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-5">
      <div className="px-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Country">
          <Select value={audience.country} onChange={(v) => update("country", v)} options={COUNTRIES} />
        </Field>
        <Field label="Language">
          <Select value={audience.language} onChange={(v) => update("language", v)} options={LANGUAGES} />
        </Field>
        <Field label="Wallet Type">
          <Select value={audience.walletType} onChange={(v) => update("walletType", v)} options={WALLET_TYPES} />
        </Field>
        <Field label="Minimum User Level">
          <Select value={audience.minLevel} onChange={(v) => update("minLevel", v)} options={USER_LEVELS} />
        </Field>
      </div>

      <div className="px-4 border-t border-border pt-4 space-y-1">
        <Toggle checked={audience.kycRequired} onChange={(v) => update("kycRequired", v)} label="KYC Required" hint="Only allow users who have completed identity verification" />
        <Toggle checked={audience.returningUsers} onChange={(v) => update("returningUsers", v)} label="Returning Users" hint="Users who have completed at least 1 prior campaign" />
        <Toggle checked={audience.newUsers} onChange={(v) => update("newUsers", v)} label="New Users" hint="Users who joined TaskKash within the last 30 days" />
        <Toggle checked={audience.vipUsers} onChange={(v) => update("vipUsers", v)} label="VIP Users Only" hint="Restrict to TaskKash VIP tier members" />
        <Toggle checked={audience.referralRequired} onChange={(v) => update("referralRequired", v)} label="Referral Required" hint="User must have joined via a referral link" />
      </div>

      <div className="px-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-4">
        <Field label="Whitelist (wallet addresses / emails)" hint="One per line, leave empty to allow all">
          <TextArea
            rows={3}
            placeholder="8xY2...k9Fp&#10;user@email.com"
            className="font-mono"
            value={audience.whitelist || ""}
            onChange={(e) => update("whitelist", e.target.value)}
          />
        </Field>
        <Field label="Blacklist (wallet addresses / emails)" hint="One per line">
          <TextArea
            rows={3}
            placeholder="3nR7...m2Lq"
            className="font-mono"
            value={audience.blacklist || ""}
            onChange={(e) => update("blacklist", e.target.value)}
          />
        </Field>
      </div>
    </div>
  );
}

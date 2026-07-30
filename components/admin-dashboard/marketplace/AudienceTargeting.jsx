import React from "react";
import { Field, Select, Toggle, TextArea } from "../ui/FormControls";

const COUNTRIES = ["All Countries", "Nigeria", "Ghana", "Kenya", "South Africa", "United States", "United Kingdom"];
const LANGUAGES = ["All Languages", "English", "French", "Portuguese", "Swahili"];
const WALLET_TYPES = ["Any Wallet", "Phantom", "Solflare", "Trust Wallet", "Backpack"];
const USER_LEVELS = ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5"];

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
          />
        </Field>
        <Field label="Blacklist (wallet addresses / emails)" hint="One per line">
          <TextArea
            rows={3}
            placeholder="3nR7...m2Lq"
            className="font-mono"
          />
        </Field>
      </div>
    </div>
  );
}

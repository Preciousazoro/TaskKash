import React from "react";
import { Coins } from "lucide-react";
import { Field, TextInput, Select } from "../ui/FormControls";
import { DISTRIBUTION_METHODS } from "../data/constants";

export default function RewardSettings({ form, setField }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 px-4 gap-4">
      <Field label="Reward Amount (TP per user)" required>
        <div className="relative">
          <Coins size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-500" />
          <TextInput className="pl-9" type="number" value={form.rewardAmount} onChange={(e) => setField("rewardAmount", e.target.value)} placeholder="e.g. 1500" />
        </div>
      </Field>
      <Field label="Total Reward Pool (TP)" required>
        <TextInput type="number" value={form.rewardPool} onChange={(e) => setField("rewardPool", e.target.value)} placeholder="e.g. 4500000" />
      </Field>
      <Field label="Maximum Participants">
        <TextInput type="number" value={form.maxParticipants} onChange={(e) => setField("maxParticipants", e.target.value)} placeholder="e.g. 5000" />
      </Field>
      <Field label="Maximum Claims Per User">
        <TextInput type="number" value={form.maxClaimsPerUser} onChange={(e) => setField("maxClaimsPerUser", e.target.value)} placeholder="e.g. 1" />
      </Field>
      <Field label="Reward Delay (hours)" hint="Time before points become claimable after approval">
        <TextInput type="number" value={form.rewardDelay} onChange={(e) => setField("rewardDelay", e.target.value)} placeholder="0" />
      </Field>
      <Field label="Reward Expiration (days)" hint="Unclaimed points expire after this period">
        <TextInput type="number" value={form.rewardExpiration} onChange={(e) => setField("rewardExpiration", e.target.value)} placeholder="90" />
      </Field>
      <Field label="Distribution Method" className="sm:col-span-2">
        <Select value={form.distributionMethod} onChange={(v) => setField("distributionMethod", v)} options={DISTRIBUTION_METHODS} />
      </Field>
    </div>
  );
}

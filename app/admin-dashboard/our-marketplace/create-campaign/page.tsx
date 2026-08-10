'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import {
  Info, Coins, ListChecks, Layers, ShieldCheck, Target, Image as ImageIcon,
  HelpCircle, Eye, Save, Send, ArrowLeft,
} from "lucide-react";
import FormSection from "@/components/admin-dashboard/marketplace/FormSection";
import SectionNav from "@/components/admin-dashboard/marketplace/SectionNav";
import RequirementsBuilder, { emptyRequirement } from "@/components/admin-dashboard/marketplace/RequirementsBuilder";
import InstructionsBuilder, { emptyStep } from "@/components/admin-dashboard/marketplace/InstructionsBuilder";
import VerificationBuilder, { emptyField } from "@/components/admin-dashboard/marketplace/VerificationBuilder";
import FAQBuilder, { emptyFaq } from "@/components/admin-dashboard/marketplace/FAQBuilder";
import AudienceTargeting from "@/components/admin-dashboard/marketplace/AudienceTargeting";
import MediaUploader from "@/components/admin-dashboard/marketplace/MediaUploader";
import RewardSettings from "@/components/admin-dashboard/marketplace/RewardSettings";
import CampaignPreview from "@/components/admin-dashboard/marketplace/CampaignPreview";
import { Field, TextInput, TextArea, Select, Toggle } from "@/components/admin-dashboard/ui/FormControls";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "react-toastify";
import { CAMPAIGN_TYPES, CATEGORIES } from "@/components/admin-dashboard/data/constants";

const SECTIONS = [
  { id: "basic", label: "Basic Information", icon: Info },
  { id: "reward", label: "Reward Settings", icon: Coins },
  { id: "requirements", label: "Requirements", icon: ListChecks },
  { id: "instructions", label: "Instructions", icon: Layers },
  { id: "verification", label: "Verification", icon: ShieldCheck },
  { id: "audience", label: "Audience Targeting", icon: Target },
  { id: "media", label: "Media", icon: ImageIcon },
  { id: "faq", label: "FAQ", icon: HelpCircle },
  { id: "preview", label: "Preview", icon: Eye },
];

export default function CreateCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingCampaign, setExistingCampaign] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    brandName: "",
    brandLogo: "",
    banner: "",
    website: "",
    description: "",
    shortDescription: "",
    type: "social",
    category: "Web3",
    subcategory: "",
    tags: "",
    featured: false,
    trending: false,
    visibility: "draft",
    rewardAmount: "",
    rewardPool: "",
    maxParticipants: "",
    maxClaimsPerUser: 1,
    rewardDelay: 0,
    rewardExpiration: 90,
    distributionMethod: "Automatic",
    endsAt: "",
  });

  const [requirements, setRequirements] = useState([emptyRequirement()]);
  const [steps, setSteps] = useState([emptyStep()]);
  const [verificationMode, setVerificationMode] = useState("manual");
  const [verificationFields, setVerificationFields] = useState([emptyField()]);
  const [faqs, setFaqs] = useState([emptyFaq()]);
  const [audience, setAudience] = useState({
    country: "all",
    language: "all",
    walletType: "any",
    minLevel: "1",
    kycRequired: false,
    returningUsers: false,
    newUsers: false,
    vipUsers: false,
    referralRequired: false,
  });
  const [media, setMedia] = useState({ 
    logo: null, 
    banner: null, 
    gallery: null, 
    video: "", 
    whitepaper: "", 
    attachments: "" 
  });
  const [activeSection, setActiveSection] = useState("basic");

  // Load existing campaign data if editing
  useEffect(() => {
    if (isEditing && id) {
      fetchExistingCampaign(id);
    }
  }, [isEditing, id]);

  const fetchExistingCampaign = async (campaignId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/marketplace-campaigns/${campaignId}`);
      const data = await response.json();
      
      if (data.success && data.campaign) {
        const campaign = data.campaign;
        setExistingCampaign(campaign);
        setForm({
          name: campaign.name || "",
          brandName: campaign.brandName || "",
          brandLogo: campaign.brandLogo || "",
          banner: campaign.media?.banner || "",
          website: campaign.website || "",
          description: campaign.description || "",
          shortDescription: campaign.shortDescription || "",
          type: campaign.type || "social",
          category: campaign.category || "Web3",
          subcategory: campaign.subcategory || "",
          tags: campaign.tags || "",
          featured: campaign.featured || false,
          trending: campaign.trending || false,
          visibility: campaign.visibility || "draft",
          rewardAmount: campaign.rewardAmount || "",
          rewardPool: campaign.rewardPool || "",
          maxParticipants: campaign.maxParticipants || "",
          maxClaimsPerUser: campaign.maxClaimsPerUser || 1,
          rewardDelay: campaign.rewardDelay || 0,
          rewardExpiration: campaign.rewardExpiration || 90,
          distributionMethod: campaign.distributionMethod || "Automatic",
          endsAt: campaign.endsAt ? new Date(campaign.endsAt).toISOString().split('T')[0] : "",
        });
        
        // Load complex fields
        if (campaign.requirements && campaign.requirements.length > 0) {
          setRequirements(campaign.requirements);
        }
        if (campaign.steps && campaign.steps.length > 0) {
          setSteps(campaign.steps);
        }
        if (campaign.verificationMode) {
          setVerificationMode(campaign.verificationMode);
        }
        if (campaign.verificationFields && campaign.verificationFields.length > 0) {
          setVerificationFields(campaign.verificationFields);
        }
        if (campaign.faqs && campaign.faqs.length > 0) {
          setFaqs(campaign.faqs);
        }
        if (campaign.audience) {
          setAudience(campaign.audience);
        }
        if (campaign.media) {
          setMedia({
            logo: campaign.media.logo || null,
            banner: campaign.media.banner || null,
            gallery: campaign.media.gallery || null,
            video: campaign.media.video || "",
            whitepaper: campaign.media.whitepaper || "",
            attachments: campaign.media.attachments || "",
          });
        }
      }
    } catch (error) {
      console.error('Error fetching campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const setField = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  // Show loading state when fetching existing campaign
  if (loading && isEditing) {
    return (
      <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-30">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading campaign data...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const handleSaveDraft = async () => {
    console.log('[handleSaveDraft] Called, loading:', loading, 'isSubmitting:', isSubmitting);
    if (loading || isSubmitting) return; // Prevent double submission
    
    try {
      setIsSubmitting(true);
      setLoading(true);
      console.log('[handleSaveDraft] Starting submission');
      
      const campaignData = {
        ...form,
        visibility: "draft",
        requirements: requirements.filter(r => r.description && r.description.trim() !== ''),
        steps: steps.filter(s => s.title && s.title.trim() !== '' && s.description && s.description.trim() !== ''),
        verificationMode,
        verificationFields: verificationFields.filter(f => f.label && f.label.trim() !== ''),
        faqs: faqs.filter(f => f.question && f.question.trim() !== '' && f.answer && f.answer.trim() !== ''),
        audience,
        media,
        endsAt: form.endsAt ? new Date(form.endsAt) : null,
      };

      let response;
      if (isEditing && id) {
        response = await fetch(`/api/admin/marketplace-campaigns/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(campaignData),
        });
      } else {
        response = await fetch('/api/admin/marketplace-campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(campaignData),
        });
      }

      const data = await response.json();

      if (data.success) {
        toast("Campaign saved as draft.", { type: "success" });
        router.push("/admin-dashboard/our-marketplace/reward-marketplace");
      } else {
        toast(data.error || "Failed to save campaign", { type: "error" });
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast("Failed to save campaign", { type: "error" });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    console.log('[handlePublish] Called, loading:', loading, 'isSubmitting:', isSubmitting);
    if (loading || isSubmitting) return; // Prevent double submission
    
    if (!form.name || !form.brandName || !form.rewardAmount) {
      toast("Please fill in campaign name, brand and reward amount before publishing.", { type: "error" });
      return;
    }

    try {
      setIsSubmitting(true);
      setLoading(true);
      
      const campaignData = {
        ...form,
        visibility: "published",
        requirements: requirements.filter(r => r.description && r.description.trim() !== ''),
        steps: steps.filter(s => s.title && s.title.trim() !== '' && s.description && s.description.trim() !== ''),
        verificationMode,
        verificationFields: verificationFields.filter(f => f.label && f.label.trim() !== ''),
        faqs: faqs.filter(f => f.question && f.question.trim() !== '' && f.answer && f.answer.trim() !== ''),
        audience,
        media,
        endsAt: form.endsAt ? new Date(form.endsAt) : null,
      };

      let response;
      if (isEditing && id) {
        response = await fetch(`/api/admin/marketplace-campaigns/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(campaignData),
        });
      } else {
        response = await fetch('/api/admin/marketplace-campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(campaignData),
        });
      }

      const data = await response.json();

      if (data.success) {
        toast(`"${form.name}" published to the marketplace.`, { type: "success" });
        router.push("/admin-dashboard/our-marketplace/reward-marketplace");
      } else {
        toast(data.error || "Failed to publish campaign", { type: "error" });
      }
    } catch (error) {
      console.error('Error publishing campaign:', error);
      toast("Failed to publish campaign", { type: "error" });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-30">
          <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <button 
                  onClick={() => router.push("/admin-dashboard/our-marketplace/reward-marketplace")} 
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
                >
                  <ArrowLeft size={13} /> Back to Marketplace
                </button>
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none">
                  {isEditing ? "Edit Campaign" : "Create Campaign"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Build a new reward campaign for the marketplace.
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Button variant="outline" onClick={handleSaveDraft} disabled={loading || isSubmitting}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading || isSubmitting ? "Saving..." : "Save Draft"}
                </Button>
                <Button className="bg-green-500 hover:bg-green-600" onClick={handlePublish} disabled={loading || isSubmitting}>
                  <Send className="w-4 h-4 mr-2" />
                  {loading || isSubmitting ? "Publishing..." : (isEditing ? "Save Changes" : "Publish Campaign")}
                </Button>
              </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
              {/* SECTION NAV */}
              <div className="hidden lg:block">
                <SectionNav sections={SECTIONS} active={activeSection} onSectionClick={setActiveSection} />
              </div>

              {/* FORM SECTIONS */}
              <div className="space-y-5 min-w-0">
                <FormSection id="basic" title="Basic Information" subtitle="Core campaign details" icon={Info}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 px-4 gap-4">
                    <Field label="Campaign Name" required className="sm:col-span-2">
                      <TextInput 
                        value={form.name} 
                        onChange={(e) => setField("name", e.target.value)} 
                        placeholder="e.g. Hold $SLND for 30 Days" 
                      />
                    </Field>
                    <Field label="Brand Name" required>
                      <TextInput 
                        value={form.brandName} 
                        onChange={(e) => setField("brandName", e.target.value)} 
                        placeholder="e.g. Solend Finance" 
                      />
                    </Field>
                    <Field label="Brand Logo (emoji or URL)">
                      <TextInput 
                        value={form.brandLogo} 
                        onChange={(e) => setField("brandLogo", e.target.value)} 
                        placeholder="🟢 or https://..." 
                      />
                    </Field>
                    <Field label="Website">
                      <TextInput 
                        value={form.website} 
                        onChange={(e) => setField("website", e.target.value)} 
                        placeholder="e.g. solend.fi" 
                      />
                    </Field>
                    <Field label="Campaign Ends">
                      <TextInput 
                        type="date" 
                        value={form.endsAt} 
                        onChange={(e) => setField("endsAt", e.target.value)} 
                      />
                    </Field>
                    <Field label="Short Description" hint="Shown on campaign cards, max 100 characters" className="sm:col-span-2">
                      <TextInput 
                        value={form.shortDescription} 
                        onChange={(e) => setField("shortDescription", e.target.value)} 
                        placeholder="One-line summary for the marketplace grid" 
                        maxLength={100} 
                      />
                    </Field>
                    <Field label="Full Description" className="sm:col-span-2">
                      <TextArea 
                        rows={4} 
                        value={form.description} 
                        onChange={(e) => setField("description", e.target.value)} 
                        placeholder="Detailed description shown on the campaign detail page" 
                      />
                    </Field>
                    <Field label="Campaign Type" required>
                      <Select 
                        value={form.type} 
                        onChange={(v) => setField("type", v)} 
                        options={CAMPAIGN_TYPES.map((t) => ({ value: t.id, label: t.label }))} 
                      />
                    </Field>
                    <Field label="Category" required>
                      <Select 
                        value={form.category} 
                        onChange={(v) => setField("category", v)} 
                        options={CATEGORIES} 
                      />
                    </Field>
                    <Field label="Subcategory">
                      <TextInput 
                        value={form.subcategory} 
                        onChange={(e) => setField("subcategory", e.target.value)} 
                        placeholder="e.g. DeFi Lending" 
                      />
                    </Field>
                    <Field label="Tags" hint="Comma-separated">
                      <TextInput 
                        value={form.tags} 
                        onChange={(e) => setField("tags", e.target.value)} 
                        placeholder="solana, defi, lending" 
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 px-4 gap-4 border-t border-border pt-4">
                    <Toggle 
                      checked={form.featured} 
                      onChange={(v) => setField("featured", v)} 
                      label="Featured" 
                      hint="Show in featured banner" 
                    />
                    <Toggle 
                      checked={form.trending} 
                      onChange={(v) => setField("trending", v)} 
                      label="Trending" 
                      hint="Tag as trending" 
                    />
                  </div>
                </FormSection>

                <FormSection id="reward" title="Reward Settings" subtitle="Configure Task Point distribution" icon={Coins}>
                  <RewardSettings form={form} setField={setField} />
                </FormSection>

                <FormSection id="requirements" title="Requirements Builder" subtitle="Define what users must do to qualify — unlimited, drag to reorder" icon={ListChecks}>
                  <RequirementsBuilder requirements={requirements} setRequirements={setRequirements} />
                </FormSection>

                <FormSection id="instructions" title="Instruction Builder" subtitle="Step-by-step guide shown to users — unlimited steps" icon={Layers}>
                  <InstructionsBuilder steps={steps} setSteps={setSteps} />
                </FormSection>

                <FormSection id="verification" title="Verification Builder" subtitle="Configure proof requirements and verification workflow" icon={ShieldCheck}>
                  <VerificationBuilder mode={verificationMode} setMode={setVerificationMode} fields={verificationFields} setFields={setVerificationFields} />
                </FormSection>

                <FormSection id="audience" title="Audience Targeting" subtitle="Control who can see and participate in this campaign" icon={Target}>
                  <AudienceTargeting audience={audience} setAudience={setAudience} />
                </FormSection>

                <FormSection id="media" title="Media" subtitle="Upload campaign visuals and documents" icon={ImageIcon}>
                  <MediaUploader media={media} setMedia={setMedia} />
                </FormSection>

                <FormSection id="faq" title="FAQ Builder" subtitle="Anticipate user questions — unlimited Q&As" icon={HelpCircle}>
                  <FAQBuilder faqs={faqs} setFaqs={setFaqs} />
                </FormSection>

                <FormSection id="preview" title="Campaign Preview" subtitle="Exactly matches the user-facing marketplace" icon={Eye}>
                  <CampaignPreview form={form} />
                </FormSection>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={handleSaveDraft} disabled={loading || isSubmitting}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading || isSubmitting ? "Saving..." : "Save Draft"}
                  </Button>
                  <Button className="bg-green-500 hover:bg-green-600" onClick={handlePublish} disabled={loading || isSubmitting}>
                    <Send className="w-4 h-4 mr-2" />
                    {loading || isSubmitting ? "Publishing..." : (isEditing ? "Save Changes" : "Publish Campaign")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  FileText,
  ClipboardCheck,
  CheckCircle2,
  ChevronRight,
  Upload,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Clock,
  XCircle,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PersonalInfo {
  firstName: string;
  lastName: string;
  dob: string;
  nationality: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

interface IDVerification {
  idType: string;
  idNumber: string;
  frontImage: File | null;
  backImage: File | null;
}

interface KYCStatus {
  id: string;
  submissionId: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
}

// ─── Steps Config ─────────────────────────────────────────────────────────────
const STEPS = [
  {
    id: 1,
    label: "Personal Information",
    sub: "Basic details",
    icon: User,
  },
  {
    id: 2,
    label: "ID Verification",
    sub: "Browse and upload",
    icon: FileText,
  },
  {
    id: 3,
    label: "Review",
    sub: "Confirm & submit",
    icon: ClipboardCheck,
  },
  {
    id: 4,
    label: "Status",
    sub: "Track progress",
    icon: Clock,
  },
];

const ID_TYPES = [
  "National ID Card",
  "International Passport",
  "Driver's License",
  "Residence Permit",
];

// ─── File Upload Box ──────────────────────────────────────────────────────────
const FileUploadBox = ({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (f: File) => void;
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="cursor-pointer bg-muted/30 border-2 border-dashed border-border hover:border-foreground/40 rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all group"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) onChange(e.target.files[0]);
        }}
      />
      {file ? (
        <>
          <CheckCircle2 className="w-8 h-8 text-green-500" />
          <p className="text-[10px] font-black uppercase tracking-widest text-green-500">
            {file.name.length > 22 ? file.name.slice(0, 22) + "…" : file.name}
          </p>
        </>
      ) : (
        <>
          <Upload className="w-8 h-8 text-muted-foreground group-hover:text-foreground transition-colors" />
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">
            {label}
          </p>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">
            JPG, PNG or PDF · Max 5MB
          </p>
        </>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const KYCPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    dob: "",
    nationality: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });

  const [idVerification, setIdVerification] = useState<IDVerification>({
    idType: ID_TYPES[0],
    idNumber: "",
    frontImage: null,
    backImage: null,
  });

  const updatePersonal = (field: keyof PersonalInfo, value: string) =>
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));

  const updateID = (field: keyof IDVerification, value: string | File) =>
    setIdVerification((prev) => ({ ...prev, [field]: value }));

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      // Get user data from localStorage (client-side approach)
      let userStr = localStorage.getItem("user");

      let userData;

      if (!userStr) {
        // Fallback: try to get user data from server
        try {
          const userResponse = await fetch("/api/auth/me");
          if (userResponse.ok) {
            const userDataFromServer = await userResponse.json();
            userData = {
              id: userDataFromServer.user._id || userDataFromServer.user.id,
              username:
                userDataFromServer.user.username ||
                userDataFromServer.user.fullName,
              email: userDataFromServer.user.email,
            };
            // Store in localStorage for future use
            localStorage.setItem("user", JSON.stringify(userData));
          } else {
            throw new Error("User information not found. Please login again.");
          }
        } catch (serverError) {
          throw new Error("User information not found. Please login again.");
        }
      } else {
        userData = JSON.parse(userStr);
      }

      if (!userData.id || !userData.username || !userData.email) {
        throw new Error("Invalid user information. Please login again.");
      }

      const formData = new FormData();

      // Add user data
      formData.append("userId", userData.id);
      formData.append("username", userData.username);
      formData.append("userEmail", userData.email);

      // Add personal info
      formData.append("firstName", personalInfo.firstName);
      formData.append("lastName", personalInfo.lastName);
      formData.append("dob", personalInfo.dob);
      formData.append("nationality", personalInfo.nationality);
      formData.append("address", personalInfo.address);
      formData.append("city", personalInfo.city);
      formData.append("country", personalInfo.country);
      formData.append("postalCode", personalInfo.postalCode);

      // Add ID verification
      formData.append("idType", idVerification.idType);
      formData.append("idNumber", idVerification.idNumber);

      // Add images
      if (idVerification.frontImage && idVerification.backImage) {
        formData.append("frontImage", idVerification.frontImage);
        formData.append("backImage", idVerification.backImage);
      } else {
        throw new Error("Both front and back images are required");
      }

      // Log form data before sending for debugging
      console.log("KYC Client - Sending form data:", {
        userId: userData.id,
        username: userData.username,
        userEmail: userData.email,
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        dob: personalInfo.dob,
        nationality: personalInfo.nationality,
        address: personalInfo.address,
        city: personalInfo.city,
        country: personalInfo.country,
        postalCode: personalInfo.postalCode,
        idType: idVerification.idType,
        idNumber: idVerification.idNumber,
        frontImage: idVerification.frontImage ? "File present" : "No file",
        backImage: idVerification.backImage ? "File present" : "No file",
      });

      const response = await fetch("/api/kyc", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit KYC");
      }

      // Show success toast
      toast.success("KYC submitted successfully!", {
        description: "Your documents are now under review.",
        duration: 5000,
      });

      setSubmitting(false);
      setSubmitted(true);

      // Store submission state in localStorage for persistence
      localStorage.setItem("kycSubmitted", "true");

      // Move to status step
      setTimeout(() => {
        setCurrentStep(4);
        fetchKYCStatus();
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit KYC";

      // Customize error message based on actual error
      let errorTitle = "Submission failed";
      if (errorMessage.includes("already have a KYC")) {
        errorTitle = "KYC under review";
      } else if (errorMessage.includes("pending")) {
        errorTitle = "KYC pending review";
      } else if (errorMessage.includes("All fields are required")) {
        errorTitle = "Missing required fields";
      }

      // Show error toast
      toast.error(errorTitle, {
        description: errorMessage,
        duration: 5000,
      });

      setSubmitting(false);
      setError(errorMessage);
    }
  };

  const fetchKYCStatus = async () => {
    setLoadingStatus(true);
    setError(null);

    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        throw new Error("User information not found");
      }

      const userData = JSON.parse(userStr);

      if (!userData.id) {
        throw new Error("Invalid user information");
      }

      const response = await fetch(`/api/kyc?userId=${userData.id}`);
      const result = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setKycStatus(null);
        } else {
          throw new Error(result.error || "Failed to fetch KYC status");
        }
      } else {
        setKycStatus(result.kyc);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch KYC status",
      );
    } finally {
      setLoadingStatus(false);
    }
  };

  // Check for existing KYC on mount and set initial step
  useEffect(() => {
    // Check localStorage first for immediate response
    const kycSubmitted = localStorage.getItem("kycSubmitted");
    if (kycSubmitted === "true") {
      setCurrentStep(4);
    }

    // Then fetch fresh status from server
    fetchKYCStatus();
  }, []);

  // Navigate to step 4 if KYC status exists
  useEffect(() => {
    if (kycStatus) {
      setCurrentStep(4);
    }
  }, [kycStatus]);

  // Show success toast when entering success state
  useEffect(() => {
    if (submitted) {
      toast.success("KYC Verification Complete!", {
        description: "Your documents have been submitted for review.",
        duration: 4000,
      });
    }
  }, [submitted]);

  // ── Success Modal ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <>
        {/* Main page layout remains in background */}
        <div className="flex h-screen overflow-hidden bg-background font-sans">
          <UserSidebar/>
          <div className="flex-1 flex flex-col overflow-hidden text-foreground">
            <UserHeader/>
            <main className="flex-1 overflow-y-auto">
              <div className="max-w-7xl mx-auto space-y-10 p-4 md:p-8">
                <section className="space-y-2">
                  <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none">
                    KYC Verification
                  </h1>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-primary" />
                    Verify your identity and get started
                  </p>
                </section>
              </div>
            </main>
          </div>
        </div>

        {/* Success Modal Overlay */}
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/5 backdrop-blur-sm px-4">
          <div
            className="bg-card border border-border rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            style={{ animation: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            {/* Animated checkmark */}
            <div className="mx-auto mb-5 h-20 w-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center">
              <svg
                className="h-9 w-9 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h3 className="text-2xl font-black text-foreground mb-1 uppercase tracking-tighter">
              KYC Submitted! 🎉
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Your identity verification documents have been successfully
              submitted and are now under review.
            </p>

            <div className="bg-muted/50 rounded-2xl p-4 mb-6 text-left space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Submission ID</span>
                <span className="text-foreground font-mono text-xs">
                  {kycStatus?.submissionId
                    ? `KYC-${kycStatus.submissionId.split("-")[1]?.substring(0, 10)}`
                    : "Processing..."}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="text-yellow-600 font-semibold">
                  Pending Review
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Review Time</span>
                <span className="text-foreground font-semibold">
                  24-48 Hours
                </span>
              </div>
              <div className="flex items-center justify-between  text-sm bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-2">
                <span className="text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  Security Status
                </span>
                <span className="text-emerald-600 font-black">
                  Encrypted & Secure
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                setCurrentStep(4);
              }}
              className="w-full py-3 rounded-lg bg-green-500 text-background font-extrabold text-sm hover:opacity-90 transition-opacity cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── Step Content ─────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(
                [
                  { field: "firstName", label: "First Name", type: "text" },
                  { field: "lastName", label: "Last Name", type: "text" },
                  { field: "dob", label: "Date of Birth", type: "date" },
                  { field: "nationality", label: "Nationality", type: "text" },
                  { field: "address", label: "Home Address", type: "text" },
                  { field: "city", label: "City", type: "text" },
                  { field: "country", label: "Country", type: "text" },
                  { field: "postalCode", label: "Postal Code", type: "text" },
                ] as {
                  field: keyof PersonalInfo;
                  label: string;
                  type: string;
                }[]
              ).map(({ field, label, type }) => (
                <div key={field} className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={personalInfo[field]}
                    onChange={(e) => updatePersonal(field, e.target.value)}
                    className="w-full bg-muted/30 border-2 border-border rounded-xl p-3 text-sm font-black  tracking-tight focus:border-foreground focus:outline-none transition-all"
                    placeholder={label}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            {/* ID Type */}
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                Document Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ID_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => updateID("idType", type)}
                    className={`px-4 py-3 rounded-xl border-2 text-left transition-all duration-300 ${
                      idVerification.idType === type
                        ? "bg-foreground border-none"
                        : "bg-background border-border hover:border-muted-foreground/50"
                    }`}
                  >
                    <p
                      className={`text-xs font-black  uppercase tracking-tight ${
                        idVerification.idType === type
                          ? "text-background"
                          : "text-foreground"
                      }`}
                    >
                      {type}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* ID Number */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                Document Number
              </label>
              <input
                type="text"
                value={idVerification.idNumber}
                onChange={(e) => updateID("idNumber", e.target.value)}
                className="w-full bg-muted/30 border-2 border-border rounded-xl p-3 text-sm font-black  tracking-tight focus:border-foreground focus:outline-none transition-all"
                placeholder="Enter document number"
              />
            </div>

            {/* Upload Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Front Side
                </label>
                <FileUploadBox
                  label="Upload front of document"
                  file={idVerification.frontImage}
                  onChange={(f) =>
                    setIdVerification((prev) => ({ ...prev, frontImage: f }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Back Side
                </label>
                <FileUploadBox
                  label="Upload back of document"
                  file={idVerification.backImage}
                  onChange={(f) =>
                    setIdVerification((prev) => ({ ...prev, backImage: f }))
                  }
                />
              </div>
            </div>

            <div className="flex items-start gap-2 bg-muted/30 border border-border rounded-xl p-4">
              <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground leading-relaxed">
                Ensure your document is clear, not expired, and all four corners
                are visible. Blurry or cropped images will be rejected.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {loadingStatus ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-800">Error</p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                    <button
                      onClick={fetchKYCStatus}
                      className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            ) : !kycStatus ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  No KYC submission found
                </p>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="mt-4 text-sm text-foreground hover:text-muted-foreground font-medium"
                >
                  Start KYC Process
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Status Card */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-tight">
                      KYC Status
                    </h3>

                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      ID: {kycStatus.submissionId}
                    </span>
                  </div>

                  {/* Status Display */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          kycStatus.status === "approved"
                            ? "bg-green-100"
                            : kycStatus.status === "rejected"
                              ? "bg-red-100"
                              : kycStatus.status === "under_review"
                                ? "bg-blue-100"
                                : "bg-yellow-100"
                        }`}
                      >
                        {kycStatus.status === "approved" ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : kycStatus.status === "rejected" ? (
                          <XCircle className="w-6 h-6 text-red-600" />
                        ) : kycStatus.status === "under_review" ? (
                          <Eye className="w-6 h-6 text-blue-600" />
                        ) : (
                          <Clock className="w-6 h-6 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-sm font-bold uppercase tracking-tight ${
                            kycStatus.status === "approved"
                              ? "text-green-600"
                              : kycStatus.status === "rejected"
                                ? "text-red-600"
                                : kycStatus.status === "under_review"
                                  ? "text-blue-600"
                                  : "text-yellow-600"
                          }`}
                        >
                          {kycStatus.status === "approved"
                            ? "Approved"
                            : kycStatus.status === "rejected"
                              ? "Rejected"
                              : kycStatus.status === "under_review"
                                ? "Under Review"
                                : "Pending"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted:{" "}
                          {new Date(kycStatus.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Rejection Reason */}
                    {kycStatus.status === "rejected" &&
                      kycStatus.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-sm font-semibold text-red-800 mb-1">
                            Rejection Reason
                          </p>
                          <p className="text-sm text-red-600">
                            {kycStatus.rejectionReason}
                          </p>
                        </div>
                      )}

                    {/* Status Messages */}
                    <div className="bg-muted/30 border border-border rounded-lg p-4">
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
                        {kycStatus.status === "approved"
                          ? "✓ Your identity has been verified"
                          : kycStatus.status === "rejected"
                            ? "✗ Your KYC was rejected"
                            : kycStatus.status === "under_review"
                              ? "Your documents are being reviewed"
                              : "Your submission is being processed"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {kycStatus.status === "approved"
                          ? "You can now access all platform features."
                          : kycStatus.status === "rejected"
                            ? "Please review the rejection reason and resubmit."
                            : kycStatus.status === "under_review"
                              ? "This typically takes 24-48 hours."
                              : "We will notify you once there is an update."}
                      </p>
                    </div>

                    {/* Refresh Button */}
                     <button
                      onClick={fetchKYCStatus}
                      className="w-full bg-muted/30 cursor-pointer border border-border rounded-xl p-3 text-xs font-black uppercase tracking-widest text-foreground hover:bg-muted/50 transition-all"
                    >
                      Refresh Status
                    </button>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h4 className="text-sm font-bold uppercase tracking-tight mb-4">
                    Timeline
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5" />
                      <div className="flex-1">
                        <p className="text-xs font-medium">Submitted</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(kycStatus.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {kycStatus.updatedAt !== kycStatus.createdAt && (
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 ${
                            kycStatus.status === "approved"
                              ? "bg-green-500"
                              : kycStatus.status === "rejected"
                                ? "bg-red-500"
                                : "bg-blue-500"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-xs font-medium">
                            {kycStatus.status === "approved"
                              ? "Approved"
                              : kycStatus.status === "rejected"
                                ? "Rejected"
                                : "Status Updated"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(kycStatus.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Personal Summary */}
            <div className="bg-muted/30 border border-border rounded-xl p-5 space-y-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <User className="w-3 h-3" /> Personal Information
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    { label: "First Name", value: personalInfo.firstName },
                    { label: "Last Name", value: personalInfo.lastName },
                    { label: "Date of Birth", value: personalInfo.dob },
                    { label: "Nationality", value: personalInfo.nationality },
                    { label: "Address", value: personalInfo.address },
                    { label: "City", value: personalInfo.city },
                    { label: "Country", value: personalInfo.country },
                    { label: "Postal Code", value: personalInfo.postalCode },
                  ] as { label: string; value: string }[]
                ).map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">
                      {label}
                    </p>
                    <p className="text-xs font-black  uppercase tracking-tight">
                      {value || "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ID Summary */}
            <div className="bg-muted/30 border border-border rounded-xl p-5 space-y-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <FileText className="w-3 h-3" /> ID Verification
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">
                    Document Type
                  </p>
                  <p className="text-xs font-black  uppercase tracking-tight">
                    {idVerification.idType}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">
                    Document Number
                  </p>
                  <p className="text-xs font-black  uppercase tracking-tight">
                    {idVerification.idNumber || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">
                    Front Image
                  </p>
                  <p
                    className={`text-xs font-black  uppercase tracking-tight ${idVerification.frontImage ? "text-green-500" : "text-muted-foreground"}`}
                  >
                    {idVerification.frontImage ? "✓ Uploaded" : "Not uploaded"}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">
                    Back Image
                  </p>
                  <p
                    className={`text-xs font-black  uppercase tracking-tight ${idVerification.backImage ? "text-green-500" : "text-muted-foreground"}`}
                  >
                    {idVerification.backImage ? "✓ Uploaded" : "Not uploaded"}
                  </p>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 bg-muted/30 border border-border rounded-xl p-4">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground leading-relaxed">
                By submitting, you confirm that all information is accurate and
                the documents belong to you. Your data is encrypted and
                protected.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <UserSidebar />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Page Title */}
            <section className="space-y-2">
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter  leading-none">
                KYC Verification
              </h1>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-primary" />
                Verify your identity and get started
              </p>
            </section>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* ── Left: Stepper Sidebar ─────────────────────────────── */}
              <div className="w-full lg:w-[260px] shrink-0">
                <div className="bg-card border border-border rounded-[1rem] p-5 md:p-6 space-y-1">
                  {STEPS.map((step, idx) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.id;
                    const isDone = currentStep > step.id;
                    return (
                      <div key={step.id} className="flex items-start gap-4">
                        {/* Icon + line */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                              isDone
                                ? "bg-foreground border-foreground"
                                : isActive
                                  ? "bg-foreground border-foreground"
                                  : "bg-muted/30 border-border"
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-background" />
                            ) : (
                              <Icon
                                className={`w-4 h-4 ${isActive ? "text-background" : "text-muted-foreground"}`}
                              />
                            )}
                          </div>
                          {idx < STEPS.length - 1 && (
                            <div
                              className={`w-0.5 h-10 mt-1 transition-all duration-500 ${
                                isDone ? "bg-foreground" : "bg-border"
                              }`}
                            />
                          )}
                        </div>

                        {/* Label */}
                        <div className="pt-2 pb-6">
                          <p
                            className={`text-xs font-black  uppercase tracking-tight ${
                              isActive || isDone
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                            {step.sub}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Right: Step Content ───────────────────────────────── */}
              <div className="flex-1">
                <div className="bg-card border border-border rounded-[1rem] p-5 md:p-7 shadow-sm space-y-8">
                  {/* Step Header */}
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      Step {currentStep}/{STEPS.length}
                    </p>
                    <h2 className="text-xl md:text-2xl font-black  uppercase tracking-tighter">
                      {STEPS[currentStep - 1].label}
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {currentStep === 1 &&
                        "Fill in your personal details accurately"}
                      {currentStep === 2 &&
                        "Upload a valid government-issued ID"}
                      {currentStep === 3 &&
                        "Review your information before submitting"}
                      {currentStep === 4 &&
                        "Track your KYC verification status"}
                    </p>
                  </div>

                  {/* Step Body */}
                  {renderStep()}

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <button
                      onClick={handleBack}
                      disabled={currentStep === 1}
                      className="flex items-center cursor-pointer gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>

                    {currentStep < 3 ? (
                      <button
                        onClick={handleNext}
                        className="bg-green-500 text-background px-6 py-3 rounded-lg font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:opacity-90 transition-all shadow-xl cursor-pointer"
                      >
                        Next <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : currentStep === 3 ? (
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="bg-green-500 text-background px-6 py-3 rounded-lg font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:opacity-90 transition-all shadow-xl cursor-pointer"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit KYC <ChevronRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="bg-green-500 text-background px-6 py-3 rounded-lg font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:opacity-90 transition-all shadow-xl cursor-pointer"
                      >
                        Submit New KYC <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default KYCPage;

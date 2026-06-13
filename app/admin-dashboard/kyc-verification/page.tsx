"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  FileText,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  Eye,
  ShieldCheck,
  Calendar,
  Loader2,
} from "lucide-react";
import { toast, Toaster } from "sonner";

// Store Theme Dashboard Imports
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";
import KYCVerificationSkeleton from "@/components/LoadingSkeleton/KYCVerificationSkeleton";

// ─── Types ──────────────────────────────────────────────────────────────────
interface KYCSubmission {
  _id: string;
  userId: string;
  username: string;
  userEmail: string;
  firstName: string;
  lastName: string;
  dob: string;
  nationality: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  idType: string;
  idNumber: string;
  frontImage: string;
  backImage: string;
  submissionId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  ipAddress: string;
  userAgent: string;
  userProfile: {
    _id: string;
    username: string;
    email: string;
    profileImage: string;
    fullName: string;
  };
  reviewedAt?: string;
  rejectionReason?: string;
}

export default function AdminKYCVerificationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [kycSubmissions, setKycSubmissions] = useState<KYCSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch KYC submissions on component mount
  useEffect(() => {
    const fetchKYCSubmissions = async () => {
      try {
        const response = await fetch('/api/admin/kyc');
        const result = await response.json();
        
        if (result.success) {
          setKycSubmissions(result.kycSubmissions);
        } else {
          toast.error('Failed to fetch KYC submissions');
        }
      } catch (error) {
        console.error('Error fetching KYC submissions:', error);
        toast.error('Failed to fetch KYC submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchKYCSubmissions();
  }, []);

  const filteredSubmissions = kycSubmissions.filter((sub) => {
    const matchesSearch =
      sub.userProfile.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.userProfile.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || sub.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/kyc/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'approve' }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('KYC submission approved successfully');
        // Update local state
        setKycSubmissions(prev => 
          prev.map(sub => 
            sub._id === id 
              ? { ...sub, status: 'approved', reviewedAt: new Date().toISOString() }
              : sub
          )
        );
      } else {
        toast.error(result.error || 'Failed to approve submission');
      }
    } catch (error) {
      console.error('Error approving KYC:', error);
      toast.error('Failed to approve submission');
    }
  };

  const handleReject = async (id: string, rejectionReason?: string) => {
    try {
      const response = await fetch(`/api/admin/kyc/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reject', rejectionReason }),
      });

      const result = await response.json();

      if (result.success) {
        toast.error('KYC submission rejected');
        // Update local state
        setKycSubmissions(prev =>
          prev.map(sub =>
            sub._id === id
              ? { ...sub, status: 'rejected', reviewedAt: new Date().toISOString(), rejectionReason }
              : sub
          )
        );
      } else {
        toast.error(result.error || 'Failed to reject submission');
      }
    } catch (error) {
      console.error('Error rejecting KYC:', error);
      toast.error('Failed to reject submission');
    }
  };

  const [selectedUser, setSelectedUser] = useState<KYCSubmission | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const stats = [
    { label: "Total Submissions", value: kycSubmissions.length, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Pending Review", value: kycSubmissions.filter((k) => k.status === "pending").length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Approved", value: kycSubmissions.filter((k) => k.status === "approved").length, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Rejected", value: kycSubmissions.filter((k) => k.status === "rejected").length, icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  if (loading && kycSubmissions.length === 0) {
    return (
      <div className="flex h-screen overflow-hidden bg-background font-sans">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden text-foreground">
          <AdminHeader  />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
            <KYCVerificationSkeleton />
          </main>
          <AdminNav />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <Toaster position="top-center" richColors />
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        {/* ✅ Fix: pass sidebarOpen alongside setSidebarOpen */}
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none">
                  KYC Verification
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mt-1">
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  Security & Compliance
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-muted/30 border-2 border-border rounded-xl py-2.5 pl-10 pr-4 text-xs font-black italic tracking-tight focus:border-foreground focus:outline-none transition-all w-full md:w-64"
                  />
                </div>
                <button className="p-2.5 bg-muted/30 border-2 border-border rounded-xl text-muted-foreground hover:border-foreground/40 transition-all">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-[1rem] px-5 py-3 shadow-sm hover:shadow-md transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-black tracking-tighter text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Content Table */}
            <div className="bg-card border border-border rounded-[1rem] shadow-sm overflow-hidden">
              <>
                  {/* Filter Tabs */}
                  <div className="flex gap-1 p-2 bg-muted/30 border-b border-border">
                    {["all", "pending", "approved", "rejected"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status as "all" | "pending" | "approved" | "rejected")}
                        className={`px-5 py-2 cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          filterStatus === status
                            ? "bg-foreground text-background shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-muted-foreground text-[10px] uppercase tracking-[0.15em] font-black border-b border-border">
                          <th className="px-6 py-5">User Profile</th>
                          <th className="px-6 py-5">Document</th>
                          <th className="px-6 py-5">Date Submitted</th>
                          <th className="px-6 py-5">Status</th>
                          <th className="px-6 py-5 text-right">Review Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredSubmissions.map((submission) => (
                          <tr
                            key={submission._id}
                            className="group hover:bg-muted/30 transition-colors"
                          >
                            {/* User */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={submission.userProfile.profileImage} 
                                  alt={submission.userProfile.fullName}
                                  className="w-10 h-10 rounded-lg  cursor-pointer object-cover border border-border"
                                />
                                <div className="flex flex-col">
                                  <span className="font-black italic text-sm tracking-tight text-foreground">
                                    {submission.userProfile.fullName}
                                  </span>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                    @{submission.userProfile.username}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Document */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-500/10 rounded-lg">
                                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-tight text-foreground">
                                  {submission.idType}
                                </span>
                              </div>
                            </td>

                            {/* Date */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Calendar className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-black uppercase">
                                  {new Date(submission.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </td>

                            {/* Status Badge */}
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                  submission.status === "approved"
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    : submission.status === "rejected"
                                    ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                }`}
                              >
                                {submission.status}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => setSelectedUser(submission)}
                                  className="p-3 bg-muted/50 rounded-lg text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                                {submission.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() => handleApprove(submission._id)}
                                      className="p-3 bg-emerald-500/10 cursor-pointer hover:bg-emerald-500/20 rounded-lg text-emerald-500 transition-all"
                                    >
                                      <CheckCircle className="w-5 h-5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedUser(submission);
                                        setShowRejectModal(true);
                                      }}
                                      className="p-3 bg-rose-500/10 cursor-pointer hover:bg-rose-500/20 rounded-lg text-rose-500 transition-all"
                                    >
                                      <XCircle className="w-5 h-5" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredSubmissions.length === 0 && (
                    <div className="p-20 text-center">
                      <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-sm font-black uppercase italic text-muted-foreground">
                        No matching submissions found
                      </h3>
                    </div>
                  )}
                </>
            </div>
          </div>
        </main>

        <AdminNav />
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/10 backdrop-blur-sm px-4">
          <div
            className="bg-card border border-border rounded-3xl p-5 lg:p-5 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            style={{ animation: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-foreground uppercase tracking-tighter">
              User Details
            </h3>
            <button
              onClick={() => setSelectedUser(null)}
              className="p-3 bg-muted/50 rounded-lg text-muted-foreground transition-all cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-muted/30 rounded-xl">
            <img 
              src={selectedUser.userProfile.profileImage} 
              alt={selectedUser.userProfile.fullName}
              className="w-16 h-16 rounded-xl object-cover border border-border"
            />
            <div>
              <h4 className="font-black text-lg text-foreground">
                {selectedUser.userProfile.fullName}
              </h4>
              <p className="text-sm text-muted-foreground">
                @{selectedUser.userProfile.username}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedUser.userProfile.email}
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4 mb-6">
            <h4 className="text-lg font-black text-foreground uppercase tracking-tighter">
              Personal Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Full Name
                </p>
                <p className="font-black text-sm text-foreground">
                  {selectedUser.firstName} {selectedUser.lastName}
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Date of Birth
                </p>
                <p className="font-black text-sm text-foreground">
                  {selectedUser.dob}
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Nationality
                </p>
                <p className="font-black text-sm text-foreground">
                  {selectedUser.nationality}
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Postal Code
                </p>
                <p className="font-black text-sm text-foreground">
                  {selectedUser.postalCode}
                </p>
              </div>
            </div>
            
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                Address
              </p>
              <p className="font-black text-sm text-foreground">
                {selectedUser.address}, {selectedUser.city}, {selectedUser.country}
              </p>
            </div>
          </div>

          {/* Document Information */}
          <div className="space-y-4 mb-6">
            <h4 className="text-lg font-black text-foreground uppercase tracking-tighter">
              Document Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Document Type
                </p>
                <p className="font-black text-sm text-foreground">
                  {selectedUser.idType}
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Document Number
                </p>
                <p className="font-black text-sm text-foreground">
                  {selectedUser.idNumber}
                </p>
              </div>
            </div>
            
            {/* Document Images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                  Front Document
                </p>
                <img 
                  src={selectedUser.frontImage} 
                  alt="Front of document"
                  className="w-full h-40 object-cover rounded-lg border border-border cursor-pointer"
                  onClick={() => window.open(selectedUser.frontImage, '_blank')}
                />
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                  Back Document
                </p>
                <img 
                  src={selectedUser.backImage} 
                  alt="Back of document"
                  className="w-full h-40 object-cover rounded-lg border border-border cursor-pointer"
                  onClick={() => window.open(selectedUser.backImage, '_blank')}
                />
              </div>
            </div>
          </div>

          {/* Submission Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-black text-foreground uppercase tracking-tighter">
              Submission Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Submission ID
                </p>
                <p className="font-black text-sm text-foreground font-mono">
                  {selectedUser.submissionId}
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Status
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    selectedUser.status === "approved"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : selectedUser.status === "rejected"
                      ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  }`}
                >
                  {selectedUser.status}
                </span>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Submitted At
                </p>
                <p className="font-black text-sm text-foreground">
                  {new Date(selectedUser.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  IP Address
                </p>
                <p className="font-black text-sm text-foreground font-mono">
                  {selectedUser.ipAddress}
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {showRejectModal && selectedUser && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/10 backdrop-blur-sm px-4">
          <div
            className="bg-card border border-border rounded-3xl p-5 py-7 lg:p-7 max-w-md w-full shadow-2xl"
            style={{ animation: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-rose-500/10 rounded-xl">
                <XCircle className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-xl font-black text-foreground uppercase tracking-tighter">
                Reject KYC Submission
              </h3>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Please provide a reason for rejecting this KYC submission. This will be shown to the user.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full bg-muted/30 border-2 border-border rounded-xl p-4 text-sm focus:border-foreground focus:outline-none transition-all min-h-[120px]"
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                  setSelectedUser(null);
                }}
                className="flex-1 px-2 py-3 rounded-lg bg-muted/30 text-foreground font-bold text-sm hover:bg-muted/50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!rejectionReason.trim()) {
                    toast.error('Please provide a rejection reason');
                    return;
                  }
                  handleReject(selectedUser._id, rejectionReason);
                  setShowRejectModal(false);
                  setRejectionReason("");
                  setSelectedUser(null);
                }}
                className="flex-1 px-2 py-3 rounded-lg bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-all cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    // </div>
  );
}
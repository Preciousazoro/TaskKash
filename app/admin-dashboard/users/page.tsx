"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Users,
  UserCheck,
  UserMinus,
  Briefcase,
  Search,
  Filter,
  Trash2,
  Ban,
  Eye,
  Loader2,
  DollarSign,
  Edit,
  Shield,
  ShieldOff,
  Mail,
} from "lucide-react";
import AdminHeader from "../../../components/admin-dashboard/AdminHeader";
import AdminSidebar from "../../../components/admin-dashboard/AdminSidebar";
import { toast } from 'react-toastify';
import { UserAvatar } from "../../../components/admin-dashboard/UserAvatar";
import { UserPreviewModal } from "../../../components/admin-dashboard/UserPreviewModal";
import { confirmToast } from "../../../components/admin-dashboard/confirmToast";
import { AdminContentOnlySkeleton } from "@/components/ui/LoadingSkeleton";

interface User {
  _id: string;
  name: string;
  email: string;
  username?: string | null;
  avatarUrl?: string | null;
  role: string;
  status: string;
  points: number;
  tasksCompleted: number;
  createdAt: string;
  updatedAt: string;
  socialLinks?: any;
}

/* ---------------- COMPONENT ---------------- */
export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'admins' | 'suspended'>('all');
  const [filterCounts, setFilterCounts] = useState({
    all: 0,
    admins: 0,
    suspended: 0,
    active: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState([
    {
      label: "Total Users",
      value: "0",
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Active Users",
      value: "0",
      icon: UserCheck,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      label: "Suspended Users",
      value: "0",
      icon: UserMinus,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      label: "Admins",
      value: "0",
      icon: Shield,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [editingPoints, setEditingPoints] = useState<{ [k: string]: number }>({});
  const [loadingActions, setLoadingActions] = useState<{ [k: string]: boolean }>({});
  const [savingPoints, setSavingPoints] = useState<{ [k: string]: boolean }>({});
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  /* -------- FILTER USERS -------- */
  const filteredUsers = useMemo(() => {
    let filtered = allUsers;
    
    // Apply filter tabs
    switch (activeFilter) {
      case 'admins':
        filtered = filtered.filter(user => user.role?.toLowerCase() === 'admin');
        break;
      case 'suspended':
        filtered = filtered.filter(user => user.status?.toLowerCase() === 'suspended');
        break;
      default:
        filtered = filtered;
    }
    
    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filtered;
  }, [allUsers, activeFilter, searchTerm]);


  /* -------- FETCH USERS FROM DATABASE -------- */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setAllUsers(data.users);
      
      if (data.filterCounts) {
        setFilterCounts(data.filterCounts);
      }
      
      // Use filterCounts from API for accurate stats
      setStats([
        {
          label: "Total Users",
          value: data.filterCounts.all.toString(),
          icon: Users,
          color: "text-primary",
          bg: "bg-primary/10",
        },
        {
          label: "Active Users",
          value: data.filterCounts.active.toString(),
          icon: UserCheck,
          color: "text-teal-600",
          bg: "bg-teal-50",
        },
        {
          label: "Suspended Users",
          value: data.filterCounts.suspended.toString(),
          icon: UserMinus,
          color: "text-red-500",
          bg: "bg-red-500/10",
        },
        {
          label: "Admins",
          value: data.filterCounts.admins.toString(),
          icon: Shield,
          color: "text-purple-600",
          bg: "bg-purple-50",
        },
      ]);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  /* -------- INITIAL LOAD -------- */
  useEffect(() => {
    fetchUsers();
  }, []);

  /* -------- FILTER HANDLERS -------- */
  const handleFilterChange = (filter: 'all' | 'admins' | 'suspended') => {
    setActiveFilter(filter);
  };


  /* -------- ACTIONS (UI ONLY) -------- */
  const showToast = (msg: string, type: "success" | "error" | "info" = "info") =>
    type === "success" ? toast.success(msg) : type === "error" ? toast.error(msg) : toast(msg);

  const onViewDetails = async (u: User) => {
    try {
      // Try to fetch full user details, fallback to existing data
      const response = await fetch(`/api/admin/users/${u._id}`);
      if (response.ok) {
        const fullUser = await response.json();
        setDetailUser(fullUser);
      } else {
        setDetailUser(u);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setDetailUser(u);
    }
    setDetailOpen(true);
  };

  const updatePoints = async (id: string, value: number) => {
    try {
      setSavingPoints(prev => ({ ...prev, [id]: true }));
      
      const response = await fetch(`/api/admin/users/${id}/points`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: value })
      });

      if (!response.ok) {
        throw new Error('Failed to update points');
      }

      // Update local state after successful API call
      setAllUsers(prev =>
        prev.map(u => (u._id === id ? { ...u, points: value } : u))
      );
      setEditingPoints(prev => {
        const p = { ...prev };
        delete p[id];
        return p;
      });
      showToast("Points updated successfully", "success");
    } catch (error) {
      console.error('Error updating points:', error);
      showToast("Failed to update points", "error");
    } finally {
      setSavingPoints(prev => {
        const p = { ...prev };
        delete p[id];
        return p;
      });
    }
  };

  const toggleSuspend = async (u: User) => {
    await confirmToast({
      title: `${u.status === 'suspended' ? 'Activate' : 'Suspend'} User`,
      message: `Are you sure you want to ${u.status === 'suspended' ? 'activate' : 'suspend'} ${u.name}?`,
      confirmText: u.status === 'suspended' ? 'Activate' : 'Suspend',
      confirmButtonVariant: u.status === 'suspended' ? 'default' : 'destructive',
      onConfirm: async () => {
        setLoadingActions(prev => ({ ...prev, [u._id]: true }));
        
        try {
          const response = await fetch(`/api/admin/users/${u._id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              status: u.status === 'suspended' ? 'active' : 'suspended' 
            })
          });

          if (!response.ok) {
            throw new Error('Failed to update user status');
          }

          // Refresh user list
          await fetchUsers();
        } finally {
          setLoadingActions(prev => {
            const p = { ...prev };
            delete p[u._id];
            return p;
          });
        }
      }
    });
  };

  const makeAdmin = async (u: User) => {
    await confirmToast({
      title: 'Make Admin',
      message: `Are you sure you want to make ${u.name} an admin?`,
      confirmText: 'Make Admin',
      confirmButtonVariant: 'default',
      onConfirm: async () => {
        setLoadingActions(prev => ({ ...prev, [u._id]: true }));
        
        try {
          const response = await fetch(`/api/admin/users/${u._id}/role`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: 'admin' })
          });

          if (!response.ok) {
            throw new Error('Failed to make admin');
          }

          // Refresh user list
          await fetchUsers();
        } finally {
          setLoadingActions(prev => {
            const p = { ...prev };
            delete p[u._id];
            return p;
          });
        }
      }
    });
  };

  const removeAdmin = async (u: User) => {
    await confirmToast({
      title: 'Remove Admin',
      message: `Are you sure you want to remove admin privileges from ${u.name}?`,
      confirmText: 'Remove Admin',
      confirmButtonVariant: 'destructive',
      onConfirm: async () => {
        setLoadingActions(prev => ({ ...prev, [u._id]: true }));
        
        try {
          const response = await fetch(`/api/admin/users/${u._id}/role`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: 'user' })
          });

          if (!response.ok) {
            throw new Error('Failed to remove admin');
          }

          // Refresh user list
          await fetchUsers();
        } finally {
          setLoadingActions(prev => {
            const p = { ...prev };
            delete p[u._id];
            return p;
          });
        }
      }
    });
  };

  const deleteUser = async (u: User) => {
    await confirmToast({
      title: 'Delete User',
      message: `Are you sure you want to delete ${u.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      confirmButtonVariant: 'destructive',
      onConfirm: async () => {
        setLoadingActions(prev => ({ ...prev, [u._id]: true }));
        
        try {
          const response = await fetch(`/api/admin/users/${u._id}`, {
            method: 'DELETE'
          });

          const responseData = await response.json();

          if (!response.ok) {
            console.error('Delete API Error:', responseData);
            throw new Error(responseData.error || 'Failed to delete user');
          }

          console.log('Delete Success:', responseData);

          // Refresh user list
          setDetailOpen(false);
          await fetchUsers();
        } catch (error) {
          console.error('Delete user error:', error);
          throw error; // Re-throw to let confirmToast handle the error display
        } finally {
          setLoadingActions(prev => {
            const p = { ...prev };
            delete p[u._id];
            return p;
          });
        }
      }
    });
  };

  /* ---------------- UI ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
        <AdminSidebar />

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <AdminHeader />

          <AdminContentOnlySkeleton />
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <AdminSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none flex items-center gap-4">
                User Management
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mt-1">
                <Users className="w-3 h-3 text-primary" />
                Community Control
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search by name/email/username"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
      bg-card
      border border-border
      rounded-xl
      py-2 pl-10 pr-4
      text-sm
      text-foreground
      placeholder:text-gray-400
      dark:placeholder:text-gray-300
      focus:ring-2 focus:ring-primary/50
      w-full md:w-64
      shadow-sm
    "
                />
              </div>
              <button className="p-2 bg-card border border-border rounded-xl text-primary shadow-sm">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-card p-4 md:p-5 md:py-4 rounded-2xl border border-border shadow-sm"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-lg md:text-xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* FILTER TABS */}
        <div className="w-full flex md:justify-end mb-6">
  <div className="w-full md:w-auto flex gap-2 p-1 bg-muted rounded-lg">
    <button
      onClick={() => handleFilterChange('all')}
      className={`flex-1 md:flex-none text-center lg:px-3 py-2 rounded-md text-sm font-medium transition-all shrink-0 ${
        activeFilter === 'all'
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
      }`}
    >
      All ({filterCounts.all})
    </button>
    <button
      onClick={() => handleFilterChange('admins')}
      className={`flex-1 md:flex-none text-center lg:px-3 py-2 rounded-md text-sm font-medium transition-all shrink-0 ${
        activeFilter === 'admins'
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
      }`}
    >
      Admins ({filterCounts.admins})
    </button>
    <button
      onClick={() => handleFilterChange('suspended')}
      className={`flex-1 md:flex-none text-center lg:px-3 py-2 rounded-md text-sm font-medium transition-all shrink-0 ${
        activeFilter === 'suspended'
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
      }`}
    >
      Suspended ({filterCounts.suspended})
    </button>
  </div>
</div>

          {/* User Table */}
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            {filteredUsers.length === 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody>
                    <tr>
                      <td colSpan={5} className="px-6 py-12">
                        <div className="flex items-center justify-center py-20">
                          <div className="text-center">
                            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-sm font-black uppercase tracking-tighter mb-2">
                              {searchTerm ? "No users found" : `No ${activeFilter === 'all' ? '' : activeFilter} users found`}
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase mb-6">
                              {searchTerm
                                ? "Try adjusting your search terms"
                                : activeFilter === 'all'
                                ? "When users register, they will appear here"
                                : `No users match the ${activeFilter} filter`}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4 hidden md:table-cell">Joined</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 hidden sm:table-cell">
                        Points
                      </th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-sm">
                    {filteredUsers.map(u => (
                      <tr
                        key={u._id}
                        className="group hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar user={u} size="sm" />
                            <div className="flex flex-col">
                              <span className="font-bold text-sm text-foreground">
                                {u.name}
                              </span>
                              {u.username && (
                                <span className="text-xs text-muted-foreground">
                                  @{u.username}
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Mail className="w-3 h-3" /> {u.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell text-gray-500 font-medium">
                          {formatDate(u.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                              u.status === 'active'
                                ? 'bg-teal-500/10 text-teal-600 border-teal-500/20'
                                : u.status === 'suspended'
                                ? 'bg-red-500/10 text-red-600 border-red-500/20'
                                : 'bg-gray-500/10 text-gray-600 border-gray-500/20'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell font-bold text-[#1D429A]">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            {u.points}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            {/* View */}
                            <button
                              onClick={() => onViewDetails(u)}
                              disabled={loadingActions[u._id]}
                              className="p-3 bg-blue-500/10 text-blue-500 cursor-pointer hover:bg-blue-500/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="View User Details"
                            >
                              {loadingActions[u._id] ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>

                            {/* Make Admin (only for non-admins) */}
                            {u.role !== "admin" ? (
                              <button
                                onClick={() => makeAdmin(u)}
                                disabled={loadingActions[u._id]}
                                className="p-3 bg-purple-500/10 text-purple-500 cursor-pointer hover:bg-purple-500/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Make Admin"
                              >
                                {loadingActions[u._id] ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Shield className="w-5 h-5" />
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={() => removeAdmin(u)}
                                disabled={loadingActions[u._id]}
                                className="p-3 bg-purple-500/10 text-purple-500 cursor-pointer hover:bg-purple-500/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Remove Admin"
                              >
                                {loadingActions[u._id] ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <ShieldOff className="w-5 h-5" />
                                )}
                              </button>
                            )}

                            {/* Suspend/Unsuspend */}
                            <button
                              onClick={() => toggleSuspend(u)}
                              disabled={loadingActions[u._id]}
                              className={`p-3 cursor-pointer rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                u.status === 'suspended'
                                  ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                  : 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'
                              }`}
                              title={
                                u.status === 'suspended'
                                  ? 'Activate User'
                                  : 'Suspend User'
                              }
                            >
                              {loadingActions[u._id] ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Ban className="w-4 h-4" />
                              )}
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => deleteUser(u)}
                              disabled={loadingActions[u._id]}
                              className="p-3 bg-red-500/10 text-red-500 cursor-pointer hover:bg-red-500/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete User"
                            >
                              {loadingActions[u._id] ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* USER PREVIEW MODAL */}
          <UserPreviewModal
            user={detailUser}
            isOpen={detailOpen}
            onClose={() => setDetailOpen(false)}
            onUserUpdate={() => fetchUsers()}
          />
        </main>
      </div>
    </div>
  );
}

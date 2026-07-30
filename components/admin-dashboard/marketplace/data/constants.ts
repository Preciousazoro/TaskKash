import { 
  Wallet, 
  ShoppingCart, 
  Lock, 
  Share2, 
  Heart, 
  MessageSquare, 
  ShoppingCart as ShoppingIcon,
  Zap,
  CreditCard,
  Building2,
  Rocket,
  Users,
  Trophy,
  Star,
  Tag,
  Clock,
  Globe,
  Smartphone,
  Shield,
  ShieldCheck,
  Camera,
  FileText,
  Link as LinkIcon
} from "lucide-react";

export const CAMPAIGN_TYPES = [
  { id: "token", label: "Token Tasks", icon: Trophy },
  { id: "social", label: "Social Media", icon: Share2 },
  { id: "commerce", label: "E-commerce", icon: ShoppingIcon },
  { id: "community", label: "Community", icon: Users },
  { id: "content", label: "Content Creation", icon: MessageSquare },
  { id: "defi", label: "DeFi", icon: Wallet },
  { id: "gaming", label: "Gaming", icon: Zap },
  { id: "utility", label: "Utility", icon: CreditCard },
];

export const CATEGORIES = [
  { value: "Web3", label: "Web3" },
  { value: "AI", label: "AI" },
  { value: "Finance", label: "Finance" },
  { value: "Education", label: "Education" },
  { value: "Gaming", label: "Gaming" },
  { value: "Social", label: "Social" },
  { value: "Commerce", label: "Commerce" },
  { value: "Other", label: "Other" },
];

export const REQUIREMENT_TYPES = [
  { id: "purchase", label: "Purchase", icon: ShoppingCart },
  { id: "hold_token", label: "Hold Token", icon: Lock },
  { id: "stake", label: "Stake", icon: Trophy },
  { id: "subscribe", label: "Subscribe", icon: Heart },
  { id: "deposit", label: "Deposit", icon: Wallet },
  { id: "social_follow", label: "Social Follow", icon: Share2 },
  { id: "social_share", label: "Social Share", icon: MessageSquare },
  { id: "custom", label: "Custom Rule", icon: Star },
];

export const DISTRIBUTION_METHODS = [
  { value: "Automatic", label: "Automatic" },
  { value: "Manual", label: "Manual" },
  { value: "Batch", label: "Batch Processing" },
];

export const VERIFICATION_MODES = [
  { id: "manual", label: "Manual Review", desc: "Admin reviews each submission manually" },
  { id: "instant", label: "Instant", desc: "Automatic verification via on-chain data" },
  { id: "hybrid", label: "Hybrid", desc: "Combination of automatic and manual checks" },
];

export const VERIFICATION_FIELD_TYPES = [
  { id: "wallet", label: "Wallet Address", icon: Wallet },
  { id: "screenshot", label: "Screenshot", icon: Camera },
  { id: "text", label: "Text Proof", icon: FileText },
  { id: "link", label: "External Link", icon: LinkIcon },
  { id: "tx_hash", label: "Transaction Hash", icon: ShieldCheck },
];
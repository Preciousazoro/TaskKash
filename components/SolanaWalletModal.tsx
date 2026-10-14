"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";

interface SolanaWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SolanaWalletModal({ isOpen, onClose }: SolanaWalletModalProps) {
  const { wallets, select, connect, connected, wallet } = useWallet();
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Close modal if wallet connects successfully
  useEffect(() => {
    if (connected && wallet && connectingWallet) {
      setConnectingWallet(null);
      setError(null); // Clear any errors on successful connection
      onClose();
    }
  }, [connected, wallet, connectingWallet, onClose]);

  // Clear connecting state if it takes too long (user likely cancelled)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (connectingWallet) {
      timeout = setTimeout(() => {
        setConnectingWallet(null);
      }, 30000); // 30 second timeout
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [connectingWallet]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Handle wallet selection
  const handleSelectWallet = async (walletName: string) => {
    // Check if wallet is supported
    if (!isSupportedWallet(walletName)) {
      setError("Only Phantom and Solflare wallets are currently supported.");
      return;
    }

    setError(null);
    setConnectingWallet(walletName);

    try {
      select(walletName as any);
      // Don't call connect() here - let the wallet adapter handle it
      // The adapter will trigger connection automatically after selection
      // We'll monitor the connected state in the useEffect above
    } catch (err: any) {
      console.error("Wallet selection error:", err);
      // Only show error if it's a real error, not a user cancellation
      if (err.message && !err.message.includes('cancelled') && !err.message.includes('rejected')) {
        setError(err.message || "Unable to connect wallet. Please try again.");
      }
      setConnectingWallet(null);
    }
  };

  // Filter and sort wallets
  const installedWallets = wallets.filter(
    (w) => w.adapter.readyState === WalletReadyState.Installed
  );
  const notDetectedWallets = wallets.filter(
    (w) => w.adapter.readyState === WalletReadyState.NotDetected
  );
  const loadableWallets = wallets.filter(
    (w) => w.adapter.readyState === WalletReadyState.Loadable
  );

  const getWalletIcon = (wallet: any) => {
    if (wallet.adapter.icon) {
      return (
        <img
          src={wallet.adapter.icon}
          alt={wallet.adapter.name}
          className="w-8 h-8"
        />
      );
    }
    return null;
  };

  const getWalletStatus = (wallet: any) => {
    switch (wallet.adapter.readyState) {
      case WalletReadyState.Installed:
        return "Installed";
      case WalletReadyState.NotDetected:
        return "Not installed";
      case WalletReadyState.Loadable:
        return "Available";
      default:
        return "Unknown";
    }
  };

  const isConnecting = (walletName: string) => {
    return connectingWallet === walletName;
  };

  const canConnect = (wallet: any) => {
    return (
      wallet.adapter.readyState === WalletReadyState.Installed ||
      wallet.adapter.readyState === WalletReadyState.Loadable
    );
  };

  const isSupportedWallet = (walletName: string) => {
    const supportedWallets = ['Phantom', 'Solflare'];
    return supportedWallets.includes(walletName);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="
              fixed inset-0
              md:inset-auto md:top-1/2 md:left-1/2
              md:-translate-x-1/2 md:-translate-y-1/2
              w-full md:w-[420px]
              h-full md:h-auto md:max-h-[85vh]
              
              bg-[#0a0a0f]
              border border-border/30
              rounded-3xl
              
              shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]
              shadow-[0_0_40px_rgba(153,69,255,0.15)]
              
              z-[100]
              overflow-hidden
              flex flex-col
            "
          >
            {/* Header */}
            <div className="relative p-6 border-b border-border/20 bg-gradient-to-b from-[#9945FF]/5 to-transparent">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors group"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
              </button>

              <div className="flex items-center gap-3 mb-2">
                {/* Solana-style icon */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center shadow-lg">
                  <svg
                    viewBox="0 0 32 32"
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                  >
                    <path d="M4.5 13.5L16 2l11.5 11.5L16 25 4.5 13.5zm0 5L16 30l11.5-11.5L16 7 4.5 18.5z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-black text-white tracking-tight">
                    Connect Wallet
                  </h2>
                  <p className="text-xs text-muted-foreground font-medium">
                    Choose a wallet to connect to this platform
                  </p>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-500">
                      {error}
                    </p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-500/70 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* Installed Wallets */}
              {installedWallets.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Detected
                  </p>
                  <div className="space-y-2">
                    {installedWallets.map((wallet) => {
                      const supported = isSupportedWallet(wallet.adapter.name);
                      return (
                        <motion.button
                          key={wallet.adapter.name}
                          onClick={() => handleSelectWallet(wallet.adapter.name)}
                          disabled={isConnecting(wallet.adapter.name) || !supported}
                          whileHover={supported ? { scale: 1.02 } : {}}
                          whileTap={supported ? { scale: 0.98 } : {}}
                          className={`
                            w-full p-3 rounded-2xl border transition-all duration-200
                            flex items-center gap-4 relative overflow-hidden group
                            ${
                              isConnecting(wallet.adapter.name)
                                ? "bg-[#9945FF]/10 border-[#9945FF]/30 cursor-not-allowed"
                                : supported
                                ? "bg-white/5 border-border/30 hover:bg-white/10 hover:border-[#9945FF]/50 hover:shadow-[0_0_20px_rgba(153,69,255,0.2)]"
                                : "bg-white/5 border-border/30 opacity-50 cursor-not-allowed"
                            }
                          `}
                        >
                          {isConnecting(wallet.adapter.name) && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute inset-0 bg-[#9945FF]/5"
                            />
                          )}

                          <div className="relative z-10 flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                              {getWalletIcon(wallet)}
                            </div>

                            <div className="flex-1 text-left">
                              <p className="text-sm font-bold text-white">
                                {wallet.adapter.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {getWalletStatus(wallet)}
                              </p>
                            </div>

                          {isConnecting(wallet.adapter.name) ? (
                            <Loader2 className="w-5 h-5 text-[#9945FF] animate-spin" />
                          ) : supported ? (
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#14F195] transition-colors" />
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              Coming Soon
                            </span>
                          )}
                        </div>
                      </motion.button>
                    );
                    })}
                  </div>
                </div>
              )}

              {/* Loadable Wallets */}
              {loadableWallets.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Available
                  </p>
                  <div className="space-y-2">
                    {loadableWallets.map((wallet) => {
                      const supported = isSupportedWallet(wallet.adapter.name);
                      return (
                        <motion.button
                          key={wallet.adapter.name}
                          onClick={() => handleSelectWallet(wallet.adapter.name)}
                          disabled={isConnecting(wallet.adapter.name) || !supported}
                          whileHover={supported ? { scale: 1.02 } : {}}
                          whileTap={supported ? { scale: 0.98 } : {}}
                          className={`
                            w-full p-4 rounded-2xl border transition-all duration-200
                            flex items-center gap-4 relative overflow-hidden group
                            ${
                              isConnecting(wallet.adapter.name)
                                ? "bg-[#9945FF]/10 border-[#9945FF]/30 cursor-not-allowed"
                                : supported
                                ? "bg-white/5 border-border/30 hover:bg-white/10 hover:border-[#9945FF]/50 hover:shadow-[0_0_20px_rgba(153,69,255,0.2)]"
                                : "bg-white/5 border-border/30 opacity-50 cursor-not-allowed"
                            }
                          `}
                        >
                          {isConnecting(wallet.adapter.name) && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute inset-0 bg-[#9945FF]/5"
                            />
                          )}

                          <div className="relative z-10 flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                              {getWalletIcon(wallet)}
                            </div>

                            <div className="flex-1 text-left">
                              <p className="text-sm font-bold text-white">
                                {wallet.adapter.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {getWalletStatus(wallet)}
                              </p>
                            </div>

                          {isConnecting(wallet.adapter.name) ? (
                            <Loader2 className="w-5 h-5 text-[#9945FF] animate-spin" />
                          ) : supported ? (
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#14F195] transition-colors" />
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              Coming Soon
                            </span>
                          )}
                        </div>
                      </motion.button>
                    );
                    })}
                  </div>
                </div>
              )}

              {/* Not Detected Wallets */}
              {notDetectedWallets.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Install
                  </p>
                  <div className="space-y-2">
                    {notDetectedWallets.map((wallet) => {
                      const supported = isSupportedWallet(wallet.adapter.name);
                      return supported ? (
                        <motion.a
                          key={wallet.adapter.name}
                          href={wallet.adapter.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="
                            w-full p-4 rounded-2xl border border-border/30
                            bg-white/5
                            flex items-center gap-4
                            hover:bg-white/10 hover:border-[#14F195]/50
                            hover:shadow-[0_0_20px_rgba(20,241,149,0.2)]
                            transition-all duration-200
                            relative overflow-hidden group
                          "
                        >
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            {getWalletIcon(wallet)}
                          </div>

                          <div className="flex-1 text-left">
                            <p className="text-sm font-bold text-white">
                              {wallet.adapter.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getWalletStatus(wallet)}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 text-[#14F195]">
                            <span className="text-xs font-bold uppercase tracking-wider">
                              Install
                            </span>
                            <ExternalLink className="w-4 h-4" />
                          </div>
                        </motion.a>
                      ) : (
                        <motion.div
                          key={wallet.adapter.name}
                          className="
                            w-full p-4 rounded-2xl border border-border/30
                            bg-white/5 opacity-50
                            flex items-center gap-4
                            transition-all duration-200
                            relative overflow-hidden
                          "
                        >
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            {getWalletIcon(wallet)}
                          </div>

                          <div className="flex-1 text-left">
                            <p className="text-sm font-bold text-white">
                              {wallet.adapter.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getWalletStatus(wallet)}
                            </p>
                          </div>

                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Coming Soon
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No wallets available */}
              {wallets.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No wallets available
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/20 bg-gradient-to-t from-[#14F195]/5 to-transparent">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">
                Powered by Solana
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

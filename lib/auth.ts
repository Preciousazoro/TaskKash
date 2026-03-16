import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import {
  hasClaimedDailyBonusToday,
  createDailyLoginBonus,
} from "@/lib/transactions";
import { updateDailyStreak } from "@/lib/streak";

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  /**
   * 🔐 AUTH PROVIDERS
   */
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();

          // Find user including password
          const user = await User.findOne({ email: credentials.email }).select(
            "+password"
          );

          if (!user) return null;

          const isPasswordValid = await user.comparePassword(
            credentials.password
          );

          if (!isPasswordValid) return null;

          // Check if email is verified
          if (!user.emailVerified) {
            throw new Error('EMAIL_NOT_VERIFIED');
          }

          /**
           * 🎁 Daily login bonus (background processing)
           */
          setTimeout(async () => {
            try {
              const hasClaimed = await hasClaimedDailyBonusToday(
                user._id.toString()
              );

              if (!hasClaimed) {
                await createDailyLoginBonus(user._id.toString());
              }
            } catch (err) {
              console.error("Daily bonus error:", err);
            }
          }, 0);

          /**
           * 🔥 Update daily streak (background processing)
           */
          setTimeout(async () => {
            try {
              await updateDailyStreak(user._id.toString());
            } catch (err) {
              console.error("Daily streak error:", err);
            }
          }, 0);

          /**
           * ✅ RETURN ONLY ESSENTIAL SERIALIZABLE DATA
           */
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name ?? undefined,
            role: user.role,
            taskPoints: user.taskPoints, // Include actual balance from DB
            tasksCompleted: user.tasksCompleted, // Include tasks completed from DB
            welcomeBonusGranted: user.welcomeBonusGranted, // Include bonus status
            dailyStreak: user.dailyStreak, // Use existing streak from DB
          };
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
  ],

  /**
   * 🔑 SESSION CONFIG
   */
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },

  /**
   * 🔁 CALLBACKS - Keep minimal to prevent header overflow
   */
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Persist user data from database
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.taskPoints = user.taskPoints;
        token.tasksCompleted = user.tasksCompleted;
        token.welcomeBonusGranted = user.welcomeBonusGranted;
        token.dailyStreak = user.dailyStreak;
      }
      
      // Handle session updates
      if (trigger === "update" && session) {
        token.id = session.user.id;
      }
      
      return token;
    },

    async session({ session, token }) {
      // Attach user data from token to session
      if (session.user && token) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).taskPoints = token.taskPoints as number;
        (session.user as any).tasksCompleted = token.tasksCompleted as number;
        (session.user as any).welcomeBonusGranted = token.welcomeBonusGranted as boolean;
        (session.user as any).dailyStreak = token.dailyStreak as number;
      }
      return session;
    },
  },

  /**
   * 🔀 CUSTOM PAGES
   */
  pages: {
    signIn: "/auth/login",
  },

  /**
   * 🔐 SECRET
   */
  secret: process.env.NEXTAUTH_SECRET,
});

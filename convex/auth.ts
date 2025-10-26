import { createClient } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth";

const siteUrl = process.env.SITE_URL!;

// Component client with adapter
export const authComponent = createClient({
  adapter: components.betterAuth,
});

export const createAuth = (ctx: any, { optionsOnly } = { optionsOnly: false }) => {
  return betterAuth({
    logger: { disabled: optionsOnly },
    trustedOrigins: [siteUrl],
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      crossDomain({ siteUrl }),
      convex(),
    ],
  });
};

// Get current authenticated user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});

// Helper for protected functions
export const requireAuth = async (ctx: any) => {
  const user = await authComponent.getAuthUser(ctx);
  if (!user) {
    throw new Error("Unauthorized");
  }
  
  // Look up full user record with role/orgId
  const fullUser = await ctx.db
    .query("users")
    .withIndex("by_email", (q: any) => q.eq("email", user.email))
    .first();
    
  if (!fullUser || fullUser.status !== "Active") {
    throw new Error("User not active");
  }
  
  return fullUser;
};

// Helper for admin-only functions
export const requireAdmin = async (ctx: any) => {
  const user = await requireAuth(ctx);
  if (user.role !== "Admin") {
    throw new Error("Admin access required");
  }
  return user;
};

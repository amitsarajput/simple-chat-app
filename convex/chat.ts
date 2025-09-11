// Update your server import like this:
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: {
    user: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    //console.log("This TypeScript function is running on the server.");
    await ctx.db.insert("messages", {
      user: args.user,
      body: args.body,
      deleted_at: null, // default value
    });
  },
});
// Add the following function to the file:
export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    // Get most recent messages first
    const messages = await ctx.db.query("messages")
    .filter((q) => q.eq(q.field("deleted_at"), null))
    .order("desc")
    .take(100);
    // Reverse the list so that it's in a chronological order.
    return messages.reverse();
  },
});

export const getDeletedMessages = query(async (ctx) => {
  return await ctx.db
    .query("messages")
    .filter((q) => q.neq(q.field("deleted_at"), null))
    .collect();
});


export const deleteAllMessages = mutation(async (ctx) => {
  const messages = await ctx.db.query("messages").filter((q) => q.eq(q.field("deleted_at"), null)).collect();
  const now = Date.now();

  for (const message of messages) {
    //await ctx.db.delete(message._id);
    await ctx.db.patch(message._id, { deleted_at: now });

  }
});

export const setConversationStatus = mutation({
  args: { chatStatus: v.string() }, // "on" or "off"
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("conversations").first();

    if (existing) {
      await ctx.db.patch(existing._id, { chatStatus: args.chatStatus });
    } else {
      await ctx.db.insert("conversations", { chatStatus: args.chatStatus });
    }
  },
});

export const getConversationStatus = query({
  handler: async (ctx) => {
    const record = await ctx.db.query("conversations").first();
    return record?.chatStatus ?? "on"; // default to "on"
  },
});


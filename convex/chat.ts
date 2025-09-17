// Update your server import like this:
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";


export const sendMessage = mutation({
  args: {
    user: v.string(),
    body: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const hasText = args.body && args.body.trim() !== "";
    const hasImage = !!args.imageStorageId;

    if (!hasText && !hasImage) {
      throw new Error("Message must contain either text or an image.");
    }

    await ctx.db.insert("messages", {
      user: args.user,
      body: args.body ?? "",
      imageStorageId: args.imageStorageId ?? undefined,
      deleted_at: null,
    });
  },
});

// Add the following function to the file:
export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("deleted_at"), null))
      .order("desc")
      .take(100);

    const enriched = await Promise.all(
      messages.map(async (message) => {
        const imageUrl = message.imageStorageId
          ? await ctx.storage.getUrl(message.imageStorageId)
          : null;

        return {
          ...message,
          imageUrl,
        };
      })
    );

    return enriched.reverse(); // chronological order
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

export const deleteMessageById = mutation(async (ctx, { id }: { id: Id<"messages"> }) => {
  const now = Date.now();
  // Soft delete: update the deleted_at field
  await ctx.db.patch(id, { deleted_at: now });
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

// Generate a secure upload URL
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});




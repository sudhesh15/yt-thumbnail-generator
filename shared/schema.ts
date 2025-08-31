import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const thumbnailRequests = pgTable("thumbnail_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalPrompt: text("original_prompt").notNull(),
  refinedPrompt: text("refined_prompt"),
  customizations: jsonb("customizations").notNull(),
  uploadedImagePath: text("uploaded_image_path"),
  generatedImagePath: text("generated_image_path"),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertThumbnailRequestSchema = createInsertSchema(thumbnailRequests).pick({
  originalPrompt: true,
  customizations: true,
  uploadedImagePath: true,
});

export const customizationsSchema = z.object({
  colorScheme: z.enum(["vibrant", "professional", "dark", "minimal"]),
  textOption: z.enum(["yes-title", "yes-custom", "no"]),
  customText: z.string().optional(),
  style: z.enum(["energetic", "professional", "creative"]),
  targetEmotion: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ThumbnailRequest = typeof thumbnailRequests.$inferSelect;
export type InsertThumbnailRequest = z.infer<typeof insertThumbnailRequestSchema>;
export type Customizations = z.infer<typeof customizationsSchema>;

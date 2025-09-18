import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  userType: text("user_type").notNull(), // 'student', 'room_owner', 'tiffin_provider'
  college: text("college"),
  profileImage: text("profile_image"),
  phoneNumber: text("phone_number"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const roomListings = pgTable("room_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  rent: integer("rent").notNull(),
  location: text("location").notNull(),
  area: text("area").notNull(),
  roomType: text("room_type").notNull(), // 'single', 'double', 'triple', 'private'
  amenities: text("amenities").array(),
  images: text("images").array(),
  latitude: decimal("latitude"),
  longitude: decimal("longitude"),
  available: boolean("available").default(true),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tiffinServices = pgTable("tiffin_services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  providerId: varchar("provider_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  foodType: text("food_type").notNull(), // 'vegetarian', 'non_vegetarian', 'both', 'jain'
  lunchPrice: integer("lunch_price"),
  dinnerPrice: integer("dinner_price"),
  monthlyPrice: integer("monthly_price").notNull(),
  deliveryAreas: text("delivery_areas").array(),
  deliveryFee: integer("delivery_fee").default(0),
  menuItems: jsonb("menu_items"),
  images: text("images").array(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  available: boolean("available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  user1Id: varchar("user1_id").notNull().references(() => users.id),
  user2Id: varchar("user2_id").notNull().references(() => users.id),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => conversations.id),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  messageType: text("message_type").default("text"), // 'text', 'image', 'file'
  createdAt: timestamp("created_at").defaultNow(),
});

export const requirements = pgTable("requirements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'room', 'tiffin'
  location: text("location").notNull(),
  budgetMin: integer("budget_min"),
  budgetMax: integer("budget_max"),
  description: text("description").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  targetId: varchar("target_id").notNull(), // room or tiffin service id
  targetType: text("target_type").notNull(), // 'room', 'tiffin'
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertRoomListingSchema = createInsertSchema(roomListings).omit({ id: true, createdAt: true, rating: true, reviewCount: true });
export const insertTiffinServiceSchema = createInsertSchema(tiffinServices).omit({ id: true, createdAt: true, rating: true, reviewCount: true });
export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true, createdAt: true, lastMessageAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertRequirementSchema = createInsertSchema(requirements).omit({ id: true, createdAt: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type RoomListing = typeof roomListings.$inferSelect;
export type InsertRoomListing = z.infer<typeof insertRoomListingSchema>;
export type TiffinService = typeof tiffinServices.$inferSelect;
export type InsertTiffinService = z.infer<typeof insertTiffinServiceSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Requirement = typeof requirements.$inferSelect;
export type InsertRequirement = z.infer<typeof insertRequirementSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

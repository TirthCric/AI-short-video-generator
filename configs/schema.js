
import { pgTable, boolean, serial, text, timestamp, json, integer } from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  imageUrl: text("image_url"),
  subscription: boolean("subscription").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()?.$onUpdateFn(),
});


export const VideoData = pgTable("videoData", {
  id: serial("id").primaryKey(),
  script: json('script').notNull(),
  audioFileUrl: text("audioFileUrl").notNull(),
  captions: json("captions").notNull(),
  imageList: text("imageList").array().notNull(),
  createdBy: text("createdBy").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()?.$onUpdateFn(),
})


export const ImageCount = pgTable("imageCount", {
  id: serial("id").primaryKey(),
  count: integer("count").$default(0)
})
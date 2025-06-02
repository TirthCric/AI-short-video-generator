
import { pgTable, boolean, serial, text, timestamp, json, integer, uuid } from "drizzle-orm/pg-core";

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


// --- New VideoJobs Table (for tracking the video generation process) ---
// This table will store the state of each video generation request.
// It combines job tracking fields with the final video data fields.
export const VideoJobs = pgTable("video_jobs", {
    // Job Tracking Fields
    id: uuid("id").primaryKey().defaultRandom(), // Using UUID for unique job IDs, ideal for distributed systems
    userId: text("user_id").notNull(), // Link to the user who initiated the job (e.g., Clerk user ID)
    status: text("status").notNull().default('PENDING'), // PENDING, PROCESSING, COMPLETED, FAILED
    inputData: json("input_data"), // Stores the initial formData (topic, style, duration) from the user

    // Generated Content Fields (similar to your original VideoData structure)
    script: json('script'), // Stores the generated script (as JSON)
    audioFileUrl: text("audio_file_url"), // URL of the generated audio file
    captions: json("captions"), // Stores captions (as JSON)
    imageList: text("image_list").array(), // Array of URLs for generated images

    // Final Video Output & Error Tracking
    finalVideoUrl: text("final_video_url"), // The URL of the final Remotion-generated video
    errorMessage: text("error_message"), // Stores any error messages if the job fails

    // Timestamps
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()), // Drizzle's way to auto-update on row change
});
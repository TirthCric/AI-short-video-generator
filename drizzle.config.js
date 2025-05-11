/** @type {import("drizzle-kit").Config} */

export default {
    dialect: "postgresql",
    schema: "./configs/schema.js",
    dbCredentials:{
        url: "postgresql://neondb_owner:npg_xLDvFQwOJd91@ep-rapid-shadow-a1g6ff6n-pooler.ap-southeast-1.aws.neon.tech/AI-short-video-generatot?sslmode=require"
    }
}

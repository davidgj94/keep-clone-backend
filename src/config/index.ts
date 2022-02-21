import dotenv from "dotenv";

dotenv.config();

export default {
  PORT: parseInt(process.env.SERVER_PORT || "3000", 10),
  DATABASE_URL:
    process.env.DATABASE_URL || "mongodb://localhost:27017/keep-clone",
  MAX_RETRIES: 3,
};

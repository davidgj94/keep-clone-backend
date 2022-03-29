import dotenv from "dotenv";

dotenv.config();

export default {
  PORT: parseInt(process.env.SERVER_PORT || "5500", 10),
  DATABASE_URL:
    process.env.DATABASE_URL || "mongodb://localhost:27017/keep-clone",
  MAX_RETRIES: 3,
  JWT_SECRET: process.env.JWT_SECRET || "asdf",
  JWT_EXPIRES_DAYS: process.env.JWT_EXPIRES_DAYS
    ? parseInt(process.env.JWT_EXPIRES_DAYS)
    : 30,
  TEST_ENV: process.env.NODE_ENV === "test",
};

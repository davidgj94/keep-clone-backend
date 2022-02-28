import mongoose from "mongoose";
// Register Mongoose models
import * as models from "database/models";

beforeAll(async () => {
  await mongoose.connect(global.__MONGO_URI__, {
    dbName: global.__MONGO_DB_NAME__,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

import { connect } from "mongoose";

import config from "config";

export const initDatabase = async (maxTries: number, currentTries = 0) => {
  try {
    await connect(config.DATABASE_URL);
  } catch (err) {
    // tslint:disable-next-line: no-console
    currentTries === maxTries
      ? console.log("Error connecting to database: ", err)
      : await initDatabase(maxTries + 1);
  }
};

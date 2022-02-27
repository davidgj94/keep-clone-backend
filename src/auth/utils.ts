import jwt from "jsonwebtoken";
import moment from "moment";

import config from "config";

export const createToken = (user: { id: string }) =>
  jwt.sign({ _id: user.id }, config.JWT_SECRET, {
    expiresIn: moment.duration(config.JWT_EXPIRES_DAYS, "days").asSeconds(),
  });

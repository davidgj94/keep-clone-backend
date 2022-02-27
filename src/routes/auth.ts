import express from "express";
import { body } from "express-validator";
import passport from "passport";
import { StatusCodes } from "http-status-codes";

import { createToken } from "auth/utils";
import { ServerError } from "controller/utils";

const authRouter = express.Router();
authRouter.post(
  "/login",
  body("email").isEmail(),
  body("password").isString(),
  async (req, res, next) =>
    passport.authenticate("login", async (err, user) => {
      if (err || !user)
        return next(
          new ServerError(
            StatusCodes.UNAUTHORIZED,
            err?.message || "Unauthorized"
          )
        );
      req.login(user, { session: false }, (err) => {
        if (err) return next(err);
        res.status(StatusCodes.OK).json({
          access_token: createToken(user),
        });
      });
    })(req, res, next)
);

export default authRouter;

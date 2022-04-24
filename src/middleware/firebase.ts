import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import getAuth from "auth/firebase";
import { ServerError } from "controller/utils";

export const parseFirebaseToken: RequestHandler = (req, res, next) => {
  if (!req.headers.authorization)
    return next(
      new ServerError(StatusCodes.UNAUTHORIZED, "Missing authorization header")
    );
  let firebaseIdToken: string | undefined;
  const authorizationHeaderParts = req.headers.authorization.split(" ");
  if (
    authorizationHeaderParts.length == 2 &&
    authorizationHeaderParts[0] == "Bearer"
  )
    firebaseIdToken = authorizationHeaderParts[1];

  if (!firebaseIdToken)
    return next(
      new ServerError(
        StatusCodes.UNAUTHORIZED,
        "Incorrect authorization header format"
      )
    );

  getAuth()
    .verifyIdToken(firebaseIdToken)
    .then((decodedIdToken) => {
      req.user = { _id: decodedIdToken.uid };
      next();
    })
    .catch((err) =>
      next(
        new ServerError(StatusCodes.UNAUTHORIZED, "Incorrect Firebase ID Token")
      )
    );
};

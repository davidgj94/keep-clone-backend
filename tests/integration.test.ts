import mongoose from "mongoose";
import request from "supertest";
import { lorem } from "faker";

import app from "src";
import { createToken } from "auth/utils";

import userFactory from "./factories/user";
import labelFactory from "./factories/label";

describe("Notes routes", () => {
  let user: { id: string } & { _id: any };
  let authToken: string;

  beforeAll(async () => {
    user = (await userFactory()) as unknown as typeof user;
    authToken = createToken(user);
  });

  it("getNotes endpoint returns success", async () => {
    const label = await labelFactory({ user: user._id });
    const res = await request(app)
      .get("/api/v1/notes")
      .query({
        limit: 10,
        labelId: label.id,
      })
      .set("Authorization", "Bearer " + authToken)
      .send();
    expect(res.statusCode).toBe(200);
  });

  it("getNotes endpoint returns not found", async () => {
    const res = await request(app)
      .get("/api/v1/notes")
      .query({
        limit: 10,
        labelId: new mongoose.Types.ObjectId().toString(),
      })
      .set("Authorization", "Bearer " + authToken)
      .send();
    expect(res.statusCode).toBe(404);
  });

  it("createNote endpoint return success", async () => {
    const res = await request(app)
      .post("/api/v1/notes")
      .set("Authorization", "Bearer " + authToken)
      .send({ title: lorem.sentence(), body: lorem.sentences() });
    expect(res.statusCode).toBe(201);
  });
});

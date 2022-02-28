import faker from "faker";
import { User } from "database/models";
import createFactory from "./common";

const userFactory = createFactory(User, async () => ({
  email: faker.internet.email(),
  password: "fake_password",
}));

export default userFactory;

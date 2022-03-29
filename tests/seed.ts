import { initDatabase } from "src/database";
import { userFactory, noteFactory, labelFactory } from "./factories";
import { createToken } from "auth/utils";

const NUM_NOTES = 50;

(async () => {
  await initDatabase(3);
  const user = await userFactory();
  const labels = await Promise.all(
    new Array(3).fill(0).map(() => labelFactory({ user: user.id }))
  );
  for (let index = 0; index < NUM_NOTES; index++) {
    // await new Promise((resolve) => setTimeout(resolve, 200));
    await noteFactory({ labels: labels.map(({ id }) => id), user: user.id });
  }

  console.log(createToken(user as any));
})();

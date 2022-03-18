import { initDatabase } from "src/database";
import { userFactory, noteFactory, labelFactory } from "./factories";
import { createToken } from "auth/utils";

(async () => {
  await initDatabase(3);
  const user = await userFactory();
  const labels = await Promise.all(
    new Array(3).fill(0).map(() => labelFactory({ user: user.id }))
  );
  await Promise.all(
    new Array(3)
      .fill(0)
      .map(() =>
        noteFactory({ labels: labels.map(({ id }) => id), user: user.id })
      )
  );

  console.log(createToken(user as any));
})();

import { lorem } from "faker";
import { Label } from "database/models";
import createFactory from "./common";

const labelFactory = createFactory(Label, async () => ({
  name: lorem.word(10),
}));

export default labelFactory;

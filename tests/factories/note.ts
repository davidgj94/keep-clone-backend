import { lorem } from "faker";
import { Note } from "database/models";
import createFactory from "./common";

const noteFactory = createFactory(Note, async () => ({
  content: lorem.paragraph(5),
  title: lorem.sentence(3),
}));

export default noteFactory;

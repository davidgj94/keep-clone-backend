import mongoose from "mongoose";
import { lorem } from "faker";

import { NotesService } from "service/notes";
import { LabelService } from "service/labels";

import { Note } from "database/models";

import { labelFactory, noteFactory, userFactory } from "./factories";

const recursiveGetNotes = async (
  getNotesArgs: any,
  cursor: string | undefined = undefined,
  limit = 3
) => {
  const allNotes: any[] = [];
  const result = await NotesService.getNotes({
    cursor,
    limit,
    ...getNotesArgs,
  });
  if (result.isErr()) throw result.error.error;

  const { hasMore, notes, cursor: newCursor } = result.value;
  allNotes.push(...notes);
  if (hasMore) {
    const remainingNotes = await recursiveGetNotes(
      getNotesArgs,
      newCursor,
      limit
    );
    allNotes.push(...remainingNotes);
  }

  return allNotes;
};

describe("Get Notes service", () => {
  let userId: string;
  let labelId: string;
  let notesTitles: string[];
  let labelledNotesTitles: string[];

  beforeAll(async () => {
    const user = await userFactory({});
    const label = await labelFactory({ user: user._id });

    // Create user labelled notes
    const titlesLabelledNotes = new Array(10)
      .fill(0)
      .map(() => lorem.sentence());
    for (const title of titlesLabelledNotes) {
      await noteFactory({ labels: [label._id], user: user._id, title });
    }

    // Create user unlabelled notes
    const titlesUnlabelledNotes = new Array(10)
      .fill(0)
      .map(() => lorem.sentence());
    for (const title of titlesUnlabelledNotes) {
      await noteFactory({ user: user._id, title });
    }

    notesTitles = [...titlesLabelledNotes, ...titlesUnlabelledNotes];
    labelledNotesTitles = [...titlesLabelledNotes];
    userId = user.id;
    labelId = label.id;
  });

  it("returns LABEL_NOT_FOUND if label doesn't belong to user", async () => {
    const newLabelId = new mongoose.Types.ObjectId().toString();
    const result = await NotesService.getNotes({ userId, labelId: newLabelId });
    expect(result.isErr()).toBe(true);
    expect(result.isErr() && result.error.errType).toBe("LABEL_NOT_FOUND");
  });

  it("returns only user notes", async () => {
    const userNotes = await recursiveGetNotes({ userId });
    expect(userNotes.map(({ title }) => title)).toStrictEqual(notesTitles);
  });

  it("returns only labelled notes", async () => {
    const labelledNotes = await recursiveGetNotes({ userId, labelId });
    expect(labelledNotes.map(({ title }) => title)).toStrictEqual(
      labelledNotesTitles
    );
  });
});

describe("Upsert Note service", () => {});

describe("Get Labels service", () => {});

describe("Upsert Label service", () => {});

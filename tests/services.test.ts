import mongoose from "mongoose";
import { lorem } from "faker";

import { NotesService, notesMapper } from "service/notes";
import { LabelService } from "service/labels";
import { definitions } from "types/swagger";

import { labelFactory, noteFactory, userFactory } from "./factories";
import { User, Label, Note } from "database/models";

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

  const { hasMore, data, cursor: newCursor } = result.value;
  allNotes.push(...data);
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

describe("Notes Mapper", () => {
  it("returns DTO note", async () => {
    const user = await userFactory({});
    const labels = await Promise.all(
      new Array(10).fill(0).map(() => labelFactory({ user: user.id }))
    );

    const DTONote: definitions["Note"] = {
      title: lorem.sentence(5),
      content: lorem.sentences(5),
      archived: true,
      binned: true,
      labels: labels.map(({ id }) => id),
    };

    const DBNote = await noteFactory({ ...(DTONote as any) });
    DTONote["id"] = DBNote.id;

    expect(notesMapper(DBNote)).toStrictEqual(DTONote);
  });
});

describe("Get Notes service", () => {
  let userId: string;
  let labelId: string;
  const allNotesIds: string[] = [];
  const labelledNotesIds: string[] = [];

  beforeAll(async () => {
    const user = await userFactory({});
    const label = await labelFactory({ user: user._id });

    // Create user labelled notes
    for (const _ of new Array(10).fill(0)) {
      const note = await noteFactory({
        labels: [label._id],
        user: user._id,
      });
      allNotesIds.push(note.id as string);
      labelledNotesIds.push(note.id as string);
    }

    // Create user unlabelled notes
    for (const _ of new Array(10).fill(0)) {
      allNotesIds.push((await noteFactory({ user: user._id })).id as string);
    }

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
    expect(userNotes.map(({ id }) => id)).toStrictEqual(allNotesIds);
  });

  it("returns only labelled notes", async () => {
    const labelledNotes = await recursiveGetNotes({ userId, labelId });
    expect(labelledNotes.map(({ id }) => id)).toStrictEqual(labelledNotesIds);
  });
});

describe("Upsert Note service", () => {
  let userId: string;
  beforeAll(async () => {
    userId = (await userFactory()).id;
  });
  it("returns EMPTY_FIELDS", async () => {
    const result = await NotesService.upsertNote({ user: userId });
    expect(result.isErr()).toBe(true);
    expect(result.isErr() && result.error.errType).toBe("EMPTY_FIELDS");
  });
  it("returns NOT_FOUND_ERROR", async () => {
    const nonExistingNoteId = new mongoose.Types.ObjectId().toString();
    const result = await NotesService.upsertNote({
      user: userId,
      id: nonExistingNoteId,
    });
    expect(result.isErr()).toBe(true);
    expect(result.isErr() && result.error.errType).toBe("NOT_FOUND");
  });
  it("returns VALIDATION_ERROR", async () => {
    const nonExistingLabelId = new mongoose.Types.ObjectId().toString();
    const result = await NotesService.upsertNote({
      labels: [nonExistingLabelId],
      user: userId,
    });
    expect(result.isErr()).toBe(true);
    expect(result.isErr() && result.error.errType).toBe("VALIDATION_ERROR");
  });
});

import { omit } from "lodash";
import { definitions } from "types/swagger";
import { Mapper, ServiceResult } from "./utils";
import { err, ok } from "core/result";
import Label, { LabelDocument } from "database/models/labels";
import { Note } from "database/models";
import { upsertService } from "./common";

const labelsMapper: Mapper<LabelDocument, definitions["Label"]> = (labelDB) => {
  const labelJSON = labelDB.toJSON();
  return {
    ...omit(labelJSON, ["_id", "__v", "user"]),
  };
};

const listLabelsService = async (
  userId: string
): Promise<ServiceResult<definitions["Label"][]>> => {
  const labels = await Label.find({ user: userId });
  return ok(labels.map(labelsMapper));
};

const deleteLabelsService = async (
  labelIdToRemove: string
): Promise<ServiceResult<definitions["Label"], "LABEL_NOT_FOUND">> => {
  const deletedLabel = await Label.findByIdAndDelete(labelIdToRemove);
  if (!deletedLabel) return err({ errType: "LABEL_NOT_FOUND" });
  await Note.find({ labels: labelIdToRemove })
    .cursor()
    .eachAsync((noteDoc) => {
      noteDoc.labels = noteDoc.labels.filter(
        (labelId) => labelId.toHexString() !== labelIdToRemove
      );
      noteDoc.save();
    });
  return ok(deletedLabel);
};

export class LabelService {
  static listLabels = listLabelsService;
  static upsertLabel = upsertService(Label, labelsMapper);
  static deleteLabel = deleteLabelsService;
}

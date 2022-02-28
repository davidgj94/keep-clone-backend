import { omit } from "lodash";
import { definitions } from "types/swagger";
import { Mapper, ServiceResult } from "./utils";
import { err, ok } from "core/result";
import Label, { LabelDocument } from "database/models/labels";
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

export class LabelService {
  static listLabels = listLabelsService;
  static upsertLabel = upsertService(Label, labelsMapper);
}
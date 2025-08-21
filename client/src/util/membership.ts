import { isNullOrUndef } from "chart.js/helpers";
import { Group as GroupModel } from "../models/group";

export const isMember = (group: GroupModel, username: string) => {
  const matching = group.members.find((m) => m.id == username);
  return !isNullOrUndef(matching);
};

export const isOwner = (group: GroupModel, id: string) => {
  return group.owner == id;
};

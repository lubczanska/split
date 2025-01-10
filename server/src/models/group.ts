import { InferSchemaType, model, Schema, Types } from "mongoose";
import { Member } from "../types/member";


const groupSchema = new Schema({
  name: { type: String, required: true },
  emoji: { type: String, default: "💸" },
  currency: { type: String, default: "PLN" },
  members: { type: Types.Array<Member>, required: true },
  memberBalance: { type: Map, of: Number, required: true },
  owner: { type: Schema.Types.ObjectId, required: true },
  isPublic: { type: Boolean, default: false },
});

type Group = InferSchemaType<typeof groupSchema>;
export default model<Group>("Group", groupSchema);

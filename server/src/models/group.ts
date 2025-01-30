import { InferSchemaType, model, Schema } from "mongoose";

const groupSchema = new Schema({
  name: { type: String, required: true },
  emoji: { type: String, default: "💸" },
  currency: { type: String, default: "PLN" },
  members: { type: [{ name: String, id: String }], required: true },
  memberBalance: { type: Map, of: Number, required: true },
  owner: { type: Schema.Types.ObjectId, required: true },
  isPublic: { type: Boolean, default: false },
});

type Group = InferSchemaType<typeof groupSchema>;
export default model<Group>("Group", groupSchema);

import { InferSchemaType, model, Schema } from "mongoose";

const transferSchema = new Schema({
  groupId: { type: Schema.Types.ObjectId, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: String, required: true },
  amount: { type: Number, required: true },
});

type Transfer = InferSchemaType<typeof transferSchema>;
export default model<Transfer>("Transfer", transferSchema);

import { InferSchemaType, model, Schema } from "mongoose";

const expenseSchema = new Schema({
  groupId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  category: { type: String, default: "Others" },
  paidBy: { type: String, required: true },
  members: { type: [String], required: true },
  costSplit: { type: Map, of: Number, required: true },
});

type Expense = InferSchemaType<typeof expenseSchema>;
export default model<Expense>("Expense", expenseSchema);

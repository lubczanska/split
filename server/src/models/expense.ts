import { InferSchemaType, model, Schema } from "mongoose";

const expenseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
});

type Expense = InferSchemaType<typeof expenseSchema>;
export default model<Expense>("Expense", expenseSchema);
import { InferSchemaType, model, Schema } from "mongoose";

const expenseSchema = new Schema({
    groupId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    amount: {
        type: Number,
        required: true
    },
    category:{
        type: String,
        default: "Others"
    },
    date:{
        type: Date,
        default: Date.now
    },
    owner: {
        type: String,
        required: true
    },
    members: {
        type: Array,
        required: true
    },
    expensePerMember: {
        type: Array,
        required: true
    }
});

type Expense = InferSchemaType<typeof expenseSchema>;
export default model<Expense>("Expense", expenseSchema);
import { Expense as ExpenseModel } from "../../models/expense";
import { categoryEmoji } from "../../util/helper";

interface ViewExpenseProps {
  expense: ExpenseModel | null;
  currency?: string;
}

const ViewExpense = ({ expense, currency }: ViewExpenseProps) => {
  return expense ? (
    <div className="flex flex-col gap-2">
      <p className="text-xl">{categoryEmoji(expense.category)}</p>
      <h3 className="font-bold text-xl text-primary">{expense.name}</h3>
      <p className="">{expense.date}</p>
      <div className="flex flex-col items-start">
        <p className="font-bold">
          {expense.category == "Transfer" ? "from" : "paid By"}
        </p>
        <div className="w-full input input-bordered flex justify-between py-2 items-center">
          <p>{expense.paidBy}</p>
          <p className="font-bold">
            {expense.amount} {currency}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-start">
        <p className="font-bold">
          {" "}
          {expense.category == "Transfer"
            ? "to"
            : expense.members.length > 1
            ? `for ${expense.members.length} people:`
            : "for 1 person:"}
        </p>
        <div className="w-full join join-vertical">
          {expense.members.map((member) => (
            <div
              key={member}
              className="join-item input input-bordered flex justify-between py-2 items-center"
            >
              <p>{member}</p>
              <p className="font-bold">
                {expense.costSplit[member]} {currency}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : null;
};

export default ViewExpense;

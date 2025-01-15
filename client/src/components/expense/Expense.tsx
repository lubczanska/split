import { Expense as ExpenseModel } from "../../models/expense";

interface ExpenseProps {
  expense: ExpenseModel;
  currency: string;
  OnExpenseClicked: (expense: ExpenseModel) => void;
  OnDeleteClicked: (expense: ExpenseModel) => void;
}

const Expense = ({
  expense,
  currency,
  OnExpenseClicked,
  OnDeleteClicked,
}: ExpenseProps) => {
  function categoryEmoji(category: string) {
    const emojis: Record<string, string> = {
      Others: "💵",
      Transfer: "💸",
      Transport: "🚗",
      Food: "🍕",
      Shoppng: "🛍️",
      Entertainment: "🛍️",
      Home: "🛍️",
      Accomodation: "🛏️",
    };
    return emojis[category];
  }

  return (
    <li className="py-3 sm:py-4 ">
      <div className="flex items-center gap-4">
        <p className="text-2xl ">{categoryEmoji(expense.category)}</p>
        <div
          className="flex flex-col flex-1 min-w-0 ms-4 items-start"
          onClick={() => OnExpenseClicked(expense)}
        >
          <p className="text-sm font-medium text-gray-900 truncate ">
            {expense.name}
          </p>
          <p className="text-sm text-gray-500 truncate ">
            Paid by {expense.paidBy}
          </p>
        </div>
        <div className="inline-flex items-center text-base font-semibold text-gray-900 ">
          {`${expense.amount} ${currency} `}
        </div>

        <button
          onClick={(e) => {
            OnDeleteClicked(expense);
            e.stopPropagation();
          }}
          className="inline-flex items-center text-base font-semibold text-red-500 hover:text-white text-right"
        >
          DELETE
        </button>
      </div>
    </li>
  );
};

export default Expense;

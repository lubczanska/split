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
      Shopping: "🛍️",
      Entertainment: "🛍️",
      Home: "🛍️",
      Accomodation: "🛏️",
    };
    return emojis[category];
  }

  return (
    <li className=" bg-base-300 p-5 w-full rounded-lg ">  
      <span
        className="flex items-center gap-4 justify-between"
        onClick={() => OnExpenseClicked(expense)}
      >
        <p className="text-2xl ">{categoryEmoji(expense.category)}</p>
        <div className="grow flex flex-col items-start">
          <p className="text-sm font-semibold">{expense.name}</p>
          <p className="text-sm ">Paid by {expense.paidBy}</p>
        </div>
        <p className="font-semibold">{`${expense.amount} ${currency} `}</p>

        <button
          onClick={(e) => {
            OnDeleteClicked(expense);
            e.stopPropagation();
          }}
          className="btn btn-ghost"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </span>
    </li>
  );
};

export default Expense;

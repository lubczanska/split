import { Expense as ExpenseModel } from "../../models/expense";
import { categoryEmoji } from "../../util/helper";

interface ExpenseProps {
  expense: ExpenseModel;
  currency: string;
  OnExpenseClicked: (expense: ExpenseModel) => void;
  OnDeleteClicked: (expense: ExpenseModel) => void;
  loggedIn: boolean;
}

const Expense = ({
  expense,
  currency,
  OnExpenseClicked,
  OnDeleteClicked,
  loggedIn,
}: ExpenseProps) => {
  return (
    <li className=" bg-base-200 hover:bg-base-300 py-4 w-full rounded-lg ">
      <div
        className="flex items-center gap-4 justify-between px-3 md:px-6"
        onClick={() => OnExpenseClicked(expense)}
      >
        <p className="text-2xl grow-0 px-2 ">
          {categoryEmoji(expense.category)}
        </p>
        <div className="grow flex flex-col items-start">
          <p className="text-base font-semibold">{expense.name}</p>
          <p className="text-sm ">Paid by {expense.paidBy}</p>
          <p className="test-xs justify-self-end font-light pt-1">
            {" "}
            {expense.date}
          </p>
        </div>
        <p className="text-lg font-semibold">{`${expense.amount} ${currency} `}</p>
        {loggedIn && (
          <button
            onClick={(e) => {
              OnDeleteClicked(expense);
              e.stopPropagation();
            }}
            className="btn btn-circle btn-ghost"
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
        )}
      </div>
    </li>
  );
};

export default Expense;

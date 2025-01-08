import { Expense as ExpenseModel } from "../../models/expense";

interface ExpenseProps {
  expense: ExpenseModel;
  OnExpenseClicked: (expense: ExpenseModel) => void,
}

const Expense = ({ expense, OnExpenseClicked }: ExpenseProps) => {
  return (
      <li className="py-3 sm:py-4 dark:hover:bg-gray-700" onClick={() => OnExpenseClicked(expense)} >
      <div className="flex items-center">
          <div className="flex-1 min-w-0 ms-4">
              <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                  {expense.name}
              </p>
              <p className="text-sm text-gray-500 truncate dark:text-gray-400">
              Paid by you
              </p>
          </div>
          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
              ${expense.amount}
          </div>
          <div className="inline-flex items-center text-base font-semibold text-red-500 hover:text-white text-right"> X </div>
      </div>
  </li>
  )
};

export default Expense;

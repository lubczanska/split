import { useEffect, useState } from "react";
import "./App.css";
import { Expense as ExpenseModel } from "./models/expense";
import Expense from "./components/expense/Expense";
import * as ExpensesApi from "./network/expenses_api";
import AddExpense from "./components/expense/AddEditExpense";

function App() {
  const [expenses, setExpenses] = useState<ExpenseModel[]>([]);
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
  const [showExpenseCard, setShowExpenseCard] = useState<ExpenseModel | null>(
    null
  );
  const [expensesLoading, setExpensesLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadExpenses() {
      try {
        setError(false);
        setExpensesLoading(true);
        const expenses = await ExpensesApi.fetchExpenses();
        setExpenses(expenses);
      } catch (error) {
        setError(true);
        console.error(error);
        alert(error);
      } finally {
        setExpensesLoading(false);
      }
    }
    loadExpenses();
  }, []);

  const expenseGrid = (
    <div className="flow-root">
      <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
        {expenses.map((expense) => (
          <Expense
            expense={expense}
            key={expense._id}
            OnExpenseClicked={setShowExpenseCard}
          />
        ))}
      </ul>
    </div>
  );

  return (
    <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          Your expenses
        </h5>

        <button
          onClick={() => setShowAddExpenseDialog(true)}
          type="button"
          className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
        >
          Add expense
        </button>
      </div>
      {expensesLoading && <p className="text-white"> Loading...</p>}
      {error && <p className="text-white">Something went wrong :( </p>}
      {!expensesLoading && !error && (
        <>
          {" "}
          {expenses.length > 0 ? (
            expenseGrid
          ) : (
            <p className="text-white">Looks empty in here</p>
          )}
        </>
      )}
      {showAddExpenseDialog && (
        <AddExpense
          onDismiss={() => setShowAddExpenseDialog(false)}
          onExpenseSaved={(newExpense) => {
            setShowAddExpenseDialog(false);
            setExpenses([...expenses, newExpense]);
          }}
        />
      )}
      {showExpenseCard && (
        <AddExpense
          oldExpense={showExpenseCard}
          onDismiss={() => setShowExpenseCard(null)}
          onExpenseSaved={(updatedExpense) => {
            setExpenses(
              expenses.map((oldExpense) =>
                oldExpense._id === updatedExpense._id
                  ? updatedExpense
                  : oldExpense
              )
            );
            setShowExpenseCard(null);
          }}
        />
      )}
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import { Expense as ExpenseModel } from "../models/expense";
import Expense from "../components/expense/Expense";
import * as ExpensesApi from "../network/api";
import AddExpense from "../components/expense/AddEditExpense";
import Button from "../components/Button";
const Dashboard = () => {

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
      <ul role="list" className="divide-y divide-gray-200 ">
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
    <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 ">
        <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-bold leading-none text-gray-900">
          Your expenses
        </h5>

        <Button
          type="button"
          label="Add expense"
          onClick={() => setShowAddExpenseDialog(true)}
        />
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

export default Dashboard;
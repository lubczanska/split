// import { useEffect, useState } from "react";
import "./App.css";
// import { Expense as ExpenseModel } from "./models/expense";
// import Expense from "./components/expense/Expense";
// import * as ExpensesApi from "./network/api";
// import AddExpense from "./components/expense/AddEditExpense";
// import Button from "./components/Button";
import { BrowserRouter, Routes, Route } from "react-router";
import LogIn from "./pages/LogIn";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";

function App() {
  // const [expenses, setExpenses] = useState<ExpenseModel[]>([]);
  // const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
  // const [showExpenseCard, setShowExpenseCard] = useState<ExpenseModel | null>(
  //   null
  // );
  // const [expensesLoading, setExpensesLoading] = useState(true);
  // const [error, setError] = useState(false);

  // useEffect(() => {
  //   async function loadExpenses() {
  //     try {
  //       setError(false);
  //       setExpensesLoading(true);
  //       const expenses = await ExpensesApi.fetchExpenses();
  //       setExpenses(expenses);
  //     } catch (error) {
  //       setError(true);
  //       console.error(error);
  //       alert(error);
  //     } finally {
  //       setExpensesLoading(false);
  //     }
  //   }
  //   loadExpenses();
  // }, []);


  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;

// import { useEffect, useState } from "react";
import "./App.css";
// import { Expense as ExpenseModel } from "./models/expense";
// import Expense from "./components/expense/Expense";
// import * as ExpensesApi from "./network/api";
// import AddExpense from "./components/expense/AddEditExpense";
// import Button from "./components/Button";
import { Routes, Route, useNavigate } from "react-router-dom";
import LogIn from "./pages/LogIn";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import NavBar from "./components/NavBar";
import { useState } from "react";
import { User } from "./models/user";
import Landing from "./pages/Landing";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const navigate = useNavigate();

  return (
    <div>
      {loggedInUser && (
        <NavBar loggedInUser={loggedInUser} onAvatarClicked={() => {}} />
      )}

      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          <Route
            path="/login"
            element={
              <LogIn
                onLoginSuccessful={(user) => {
                  console.log(user);
                  setLoggedInUser(user);
                  navigate("/dashboard");
                }}
              />
            }
          />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

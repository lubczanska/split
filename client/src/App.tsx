import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import LogIn from "./components/login/LogIn";
import NotFound from "./components/NotFound";
import Dashboard from "./components/Dashboard";
import NavBar from "./components/NavBar";
import { useEffect, useState } from "react";
import { User } from "./models/user";
import Landing from "./components/Landing";
import AddGroup from "./components/group/AddGroup";
import configData from "./config.json";
import Group from "./components/group/Group";
import AddExpense from "./components/expense/AddEditExpense";
import * as Api from "./network/api";
import AddEditTransfer from "./components/expense/AddEditTransfer";
import EditGroup from "./components/group/EditGroup";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      try {
        const user = await Api.getLoggedInUser();
        if (user) {
          setLoggedInUser(user);
        }
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
    getUser();
  }, []);

  return (
    // page wrapper
    <div className="h-screen w-full relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      {/* navbar for logged in users */}
      {loggedInUser && (
        <NavBar
          loggedInUser={loggedInUser}
          onAvatarClicked={() => navigate(configData.DASHBOARD_URL)}
        />
      )}

      <main className="mx-auto w-full p-4 md:p-6 2xl:p-10">
        <Routes>
          <Route path={configData.LANDING_URL} element={<Landing />} />
          <Route path={configData.DASHBOARD_URL} element={<Dashboard />} />
          <Route path={configData.ADD_GROUP_URL} element={<AddGroup />} />
          <Route path={configData.EDIT_GROUP_URL} element={<EditGroup />} />
          <Route path={configData.VIEW_GROUP_URL} element={<Group />} />
          <Route path={configData.ADD_EXPENSE_URL} element={<AddExpense />} />
          <Route
            path={configData.ADD_TRANSFER_URL}
            element={<AddEditTransfer />}
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

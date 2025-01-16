import { Link } from "react-router";
import { User } from "../models/user";
import * as UsersApi from "../network/api";
import configData from "../config.json";

interface NavBarProps {
  loggedInUser: User | null;
}

const NavBar = ({ loggedInUser}: NavBarProps) => {
  async function onLogOut() {
    try {
      await UsersApi.logOut();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <header className="navbar bg-base-200 rounded-xl py-3 px-6">
      <div className="navbar-start">
          <span className="self-center text-xl font-semibold whitespace-nowrap">
            @{loggedInUser ? loggedInUser.username : ""}
          </span>
      </div>
      <div className="navbar-end gap-4">
        <Link to={configData.DASHBOARD_URL}>
          <button className="btn btn-outline btn-primary">Dashboard</button>
        </Link>
        <button className="btn btn-primary" onClick={onLogOut}>
          Log out
        </button>
      </div>
    </header>
  );
};

export default NavBar;

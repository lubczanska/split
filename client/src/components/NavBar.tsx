import { Link, useNavigate } from "react-router";
import { User } from "../models/user";
import * as UsersApi from "../network/api";
import configData from "../config.json";

interface NavBarProps {
  loggedInUser: User | null;
}

const NavBar = ({ loggedInUser }: NavBarProps) => {
  const navigate = useNavigate();

  async function onLogOut() {
    try {
      await UsersApi.logOut();
      navigate(configData.LANDING_URL);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <header className="navbar bg-base-100 rounded-xl py-3 px-6">
      <div className="navbar-start">
        <span className="self-center text-xl font-semibold whitespace-nowrap">
          Hi, @{loggedInUser ? loggedInUser.username : ""}
        </span>
      </div>
      {/* big screen menu */}
      <div className="navbar-end flex gap-4 justify-end">
        {/* mobile menu */}
        <div className="visible sm:invisible dropdown dropdown-end order-last">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle visible sm:invisible"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-5 w-52 p-2 shadow gap-4 "
          >
            <li className="w-full">
              <Link
                to={configData.DASHBOARD_URL}
                className="btn btn-outline btn-primary w-full "
              >
                Dashboard
              </Link>
            </li>
            <li className="w-full">
              {" "}
              <button className="btn btn-primary w-full" onClick={onLogOut}>
                Log out
              </button>
            </li>
          </ul>
        </div>
        {/* mobile menu end */}
        <div className="flex gap-4 invisible sm:visible sm:order-last">
          <Link to={configData.DASHBOARD_URL}>
            <button className="btn btn-outline btn-primary">Dashboard</button>
          </Link>
          <button className="btn btn-primary" onClick={onLogOut}>
            Log out
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;

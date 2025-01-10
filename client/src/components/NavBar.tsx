import { User } from "../models/user";
import * as UsersApi from "../network/api";
import Button from "./Button";

interface NavBarProps {
  loggedInUser: User | null;
  onAvatarClicked: () => void;
}

const NavBar = ({ loggedInUser, onAvatarClicked }: NavBarProps) => {

  async function onLogOut() {
    try {
      await UsersApi.logOut();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <nav className="border-gray-200 bg-gray-50 ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            onClick={onAvatarClicked}
            src="https://www.svgrepo.com/show/344750/emoji-smile-upside-down.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">
            Hello {loggedInUser ? loggedInUser.username : "?"}
          </span>
        </a>
        <Button label="Log Out" onClick={onLogOut} />
      </div>
    </nav>
  );
};

export default NavBar;

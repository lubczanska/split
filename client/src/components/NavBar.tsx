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
    <header className="sticky top-0 z-999 flex w-full bg-white">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 w-screen">
        <a href="#" className="flex items-center space-x-3 gap-2">
          <img
            onClick={onAvatarClicked}
            src="https://www.svgrepo.com/show/344750/emoji-smile-upside-down.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center text-xl font-semibold whitespace-nowrap">
            @{loggedInUser ? loggedInUser.username : ""}
          </span>
        </a>
        <Button label="Log Out" onClick={onLogOut} />
      </div>
    </header>
  );
};

export default NavBar;

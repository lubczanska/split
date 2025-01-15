import { useState } from "react";
import { User as UserModel } from "../models/user";
import * as Api from "../network/api";

interface SidebarProps {
  loggedInUser: UserModel | null;
  onAvatarClicked: () => void;
}

const Sidebar = ({ loggedInUser, onAvatarClicked }: SidebarProps) => {
    const [errorText,setErrorText] = useState<string | null>(null)

  async function onLogOut() {
    try {
      await Api.logOut();
    } catch (error) {
        if (error instanceof Error) setErrorText(error.message);
        else alert(error);
    }
  }
  return (
    <div>

    </div>
  )
};
export default Sidebar;

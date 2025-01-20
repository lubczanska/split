import { useEffect, useState } from "react";
import { Group as GroupModel } from "../models/group";
import * as Api from "../network/api";
import GroupCard from "./group/GroupCard";
import { useNavigate } from "react-router-dom";
import configData from "../config.json";
import { User as UserModel } from "../models/user";
import ErrorAlert from "./ErrorAlert";

const Dashboard = () => {
  const [loggedInUser, setLoggedInUser] = useState<UserModel | null>(null);
  const [groups, setGroups] = useState<GroupModel[]>([]);
  const [GroupsLoading, setGroupsLoading] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadGroups() {
      try {
        setGroupsLoading(true);
        const user = await Api.getLoggedInUser();
        if (user) {
          setLoggedInUser(user);
        } else {
          navigate(configData.LANDING_URL);
        }
        const Groups = await Api.fetchGroups();
        setGroups(Groups);
      } catch (error) {
        if (error instanceof Error) setErrorText(error.message);
        else alert(error);
      } finally {
        setGroupsLoading(false);
      }
    }
    loadGroups();
  }, []);

  const addGroup = () => {
    navigate(configData.ADD_GROUP_URL, { state: { user: loggedInUser } });
  };

  const GroupGrid = (
    <div className="px-8 py-16 flex flex-wrap gap-6">
      {groups.map((group) => (
        <GroupCard
          key={group._id}
          group={group}
          username={loggedInUser ? loggedInUser.username : ""}
        />
      ))}
      <button onClick={addGroup} className="lg:basis-1/4 grow lg:grow-0">
        <div className="card bg-primary h-full border-primary border hover:bg-base-300 justify-center items-center text-primary-content hover:text-primary">
          <div className="flex gap-4 items-start ">
            <p className="font-normal text-2xl">+</p>
            <h5 className="mb-2 text-xl font-bold">Add group</h5>
          </div>
        </div>
      </button>
    </div>
  );

  return GroupsLoading ? (
    <div className="mx-auto py-20">
      <span className="loading loading-dots loading-lg"></span>
    </div>
  ) : (
    <div className="">
      {errorText && <ErrorAlert text={errorText} />}
      <div className="flex items-center gap-8 justify-between my-4">
        <h5 className="text-2xl font-bold leading-none ">Your Groups</h5>
      </div>
      {!errorText && (
        <>
          {" "}
          {groups.length > 0 ? (
            GroupGrid
          ) : (
            <p className=" py-4">Looks empty in here :(</p>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;

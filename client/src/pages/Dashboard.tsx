import { useEffect, useState } from "react";
import { Group as GroupModel } from "../models/group";
import * as Api from "../network/api";
import GroupCard from "../components/group/GroupCard";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import configData from "../config.json";

const Dashboard = () => {
  const [groups, setGroups] = useState<GroupModel[]>([]);
  const [GroupsLoading, setGroupsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadGroups() {
      try {
        setError(false);
        setGroupsLoading(true);
        const Groups = await Api.fetchGroups();
        setGroups(Groups);
      } catch (error) {
        setError(true);
        console.error(error);
        alert(error);
      } finally {
        setGroupsLoading(false);
      }
    }
    loadGroups();
  }, []);

  const GroupGrid = (
    <div className="flow-root grid grid-cols-2 md:grid-cols-3 gap-4">
      {groups.map((group) => (
        <GroupCard group={group} />
      ))}
    </div>
  );

  return (
    <div>
      <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 ">
        <div className="flex flex-col items-center justify-between mb-4">
          <h5 className="text-xl font-bold leading-none text-gray-900">
            Your Groups
          </h5>
          <Link to={configData.ADD_GROUP_URL}>
            <Button label="New Group" />
          </Link>
        </div>
        {GroupsLoading && <p className="text-white"> Loading...</p>}
        {error && <p className="text-white">Something went wrong :( </p>}
        {!GroupsLoading && !error && (
          <>
            {" "}
            {groups.length > 0 ? (
              GroupGrid
            ) : (
              <p className="text-white">Looks empty in here</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

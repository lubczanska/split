import { useEffect, useState } from "react";
import { Group as GroupModel } from "../../models/group";
import { User as UserModel } from "../../models/user";
import * as Api from "../../network/api";
import { useNavigate, useParams } from "react-router";
import Button from "../Button";
import configData from "../../config.json";
import { ErrorAlert } from "../Alert";
import { isMember } from "../../util/membership";

const JoinGroup = () => {
  const params = useParams();
  const [loggedInUser, setLoggedInUser] = useState<UserModel | null>(null);
  const [group, setGroup] = useState<GroupModel | null>(null);
  const [membersLoading, setMembersLoading] = useState(true);
  //   const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function getGroup() {
      try {
        // setError(false);
        setMembersLoading(true);
        const groupId = params.groupId?.replace(":groupId", "");
        if (groupId) {
          const fetchedGroup = await Api.fetchGroup(groupId);
          setGroup(fetchedGroup);
          const user = await Api.getLoggedInUser();
          if (user) {
            setLoggedInUser(user);
            if (group && isMember(group, user.username))
              navigate(configData.VIEW_GROUP_URL + group._id);
          }
        } else {
          navigate(configData.DASHBOARD_URL);
        }
      } catch (error) {
        if (error instanceof Error) setErrorText(error.message);
        else alert(error);
      } finally {
        setMembersLoading(false);
      }
    }
    getGroup();
  }, [group, navigate, params.groupId]);

  async function claim(name: string) {
    try {
      if (!group) throw Error("There is no group to join");
      if (!loggedInUser) throw Error("There is no one to join");

      await Api.joinGroup(group._id, loggedInUser.username, name);
      navigate(configData.VIEW_GROUP_URL + group._id);
    } catch (error) {
      if (error instanceof Error) setErrorText(error.message);
      else alert(error);
    }
  }

  return membersLoading ? (
    <div className="mx-auto py-20">
      <span className="loading loading-dots loading-lg"></span>
    </div>
  ) : (
    <div className="card md:w-2/3  mx-auto card-bordered bg-base-200 card-compact md:card-normal">
      {errorText && <ErrorAlert text={errorText} />}
      <div className="flex justify-between">
        <h5 className="card-title">Who are you, @{loggedInUser?.username}?</h5>
      </div>
      <div className="join join-vertical">
        {group &&
          group?.members.map((value) => {
            return (
              <div key={value.name} className="join-item input input-bordered ">
                <div className="flex items-center justify-between w-full">
                  {<p className="">{value.name}</p>}
                  {value.id ? (
                    value.id == loggedInUser?.username ? (
                      <div className="badge badge-secondary">@{value.id}</div>
                    ) : (
                      <div className="badge badge-primary">@{value.id}</div>
                    )
                  ) : (
                    <Button
                      label="that's me!"
                      onClick={() => claim(value.name)}
                    />
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
export default JoinGroup;

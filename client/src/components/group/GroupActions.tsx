import { useEffect, useState } from "react";
import { Group } from "../../models/group";
import { User } from "../../models/user";
import { Link, useNavigate } from "react-router";
import configData from "../../config.json";
import * as Api from "../../network/api";

interface ActionsProps {
  user: User;
  group: Group;
  onError: (msg: string) => void;
  onShare: () => void;
  onSync: () => void;
}

const GroupActions = ({
  group,
  user,
  onError,
  onShare,
  onSync,
}: ActionsProps) => {
  const [isOwner, setIsOwner] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getActions() {
      if (group.owner == user._id) setIsOwner(true);
      if (group.members.some((member) => member.id == user.username))
        setIsMember(true);
    }
    getActions();
  }, [group.members, group.owner, user._id, user.username]);

  async function deleteGroup() {
    try {
      await Api.deleteGroup(group._id);
      navigate(configData.DASHBOARD_URL);
    } catch (error) {
      if (error instanceof Error) onError(error.message);
      else alert(error);
    }
  }

  async function leaveGroup() {
    try {
      await Api.leaveGroup(group._id, user.username);
      navigate(configData.DASHBOARD_URL);
    } catch (error) {
      if (error instanceof Error) onError(error.message);
      else alert(error);
    }
  }

  return (
    <div className="card-actions">
      <button className="btn btn-outline btn-secondary" onClick={onSync}>
        SYNC DATA
      </button>
      {isOwner ? (
        <>
          <Link to={configData.EDIT_GROUP_URL + group?._id}>
            <button className="btn btn-outline btn-secondary">EDIT</button>
          </Link>
          <button
            onClick={(e) => {
              deleteGroup();
              e.stopPropagation();
            }}
            className="btn btn-outline btn-secondary"
          >
            DELETE
          </button>
        </>
      ) : isMember ? (
        <button className="btn btn-outline btn-secondary" onClick={leaveGroup}>
          LEAVE
        </button>
      ) : (
        <button
          className="btn btn-outline btn-secondary"
          onClick={() => navigate(configData.JOIN_GROUP_URL + group._id)}
        >
          JOIN
        </button>
      )}
      <button className="btn btn-outline btn-secondary" onClick={onShare}>
        SHARE
      </button>
    </div>
  );
};

export default GroupActions;

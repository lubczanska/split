import { useEffect, useState } from "react";
import { Group } from "../../models/group";
import { User } from "../../models/user";
import { Link, useNavigate } from "react-router";
import configData from "../../config.json";
import * as Api from "../../network/api";
import { InfoAlert } from "../Alert";

interface ActionsProps {
  user: User;
  group: Group;
  onError: (msg: string) => void;
}

const GroupActions = ({ group, user, onError }: ActionsProps) => {
  const [isOwner, setIsOwner] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [showInfo, setShowInfo] = useState<string | null>(null);
  // const [showJoin, setShowJoin] = useState(false);
  // const joinRef = useRef<HTMLDialogElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getActions() {
      setShowInfo(null);
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

  function shareGroup() {
    navigator.clipboard.writeText(
      document.location.origin + configData.JOIN_GROUP_URL + group._id
    );
    setShowInfo("Join link copied to clipboard");
  }
  // async function joinGroup(name: string) {
  //   try {
  //     await Api.joinGroup(group._id, user._id, name);
  //     navigate(configData.DASHBOARD_URL);
  //   } catch (error) {
  //     if (error instanceof Error) onError(error.message);
  //     else alert(error);
  //   }
  // }

  // const JoinModal = (
  //   <dialog id="show_expense_modal" className="modal" ref={joinRef}>
  //     <div className="modal-box">
  //       <form method="dialog">
  //         <button
  //           className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
  //           onClick={() => {
  //             setShowJoin(false);
  //             if (joinRef.current) joinRef.current.close();
  //           }}
  //         >
  //           ✕
  //         </button>
  //       </form>
  //       <div className="join join-vertical">
  //         {group.members.map((member) => (
  //           <div key={member.name} className="join-item input input-bordered ">
  //             <div className="flex items-center justify-between w-full">
  //               <p className="input px-0"> {member.name} </p>
  //               {member.id ? (
  //                 <div className="badge badge-primary">{member.id}</div>
  //               ) : (
  //                 <button onClick={() => joinGroup(member.name)}> Pick </button>
  //               )}
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   </dialog>
  // );

  return (
    <div className="card-actions">
      {showInfo && <InfoAlert text={showInfo} />}
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
      <button
        className="btn btn-outline btn-secondary"
        onClick={() => shareGroup()}
      >
        SHARE
      </button>
    </div>
  );
};

export default GroupActions;

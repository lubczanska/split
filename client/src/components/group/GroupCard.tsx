import { Link } from "react-router";
import { Group as GroupModel } from "../../models/group";

interface GroupProps {
  group: GroupModel;
}

const GroupCard = ({group}: GroupProps) => {
  const groupUrl = "/dashboard/" + group._id;
  return (
    <Link to={groupUrl}>
      <div className="block max-w-sm p-4 bg-white border border-black rounded-lg  hover:bg-gray-100 ">
        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 ">
          {group.name}
        </h5>
        <p className="font-normal text-xl text-gray-700 ">{group.emoji}</p>
      </div>
    </Link>
  );
};

export default GroupCard;

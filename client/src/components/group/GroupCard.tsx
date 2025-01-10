import { Link } from "react-router";
import { Group as GroupModel } from "../../models/group";

interface GroupProps {
  group: GroupModel;
}

const GroupCard = ({group}: GroupProps) => {
  const groupUrl = "/dashboard/" + group._id;
  return (
    <Link to={groupUrl}>
      <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 ">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
          {group.name}
        </h5>
        <p className="font-normal text-gray-700 ">{group.emoji}</p>
      </div>
    </Link>
  );
};

export default GroupCard;

import { Link } from "react-router";
import { Group as GroupModel } from "../../models/group";

interface GroupProps {
  group: GroupModel;
  username: string;
}

const GroupCard = ({ group, username }: GroupProps) => {
  const groupUrl = "/dashboard/" + group._id;
  const BalanceText = () => {
    const balance = group.memberBalance[username];
    const classes = "flex flex-col items-start justify-end pt-4";
    if (balance < 0) {
      return (
        <div className={classes}>
          <p className="text-error">You owe</p>
          <p className="text-lg text-error font-semibold">
            {group.currency} {balance * -1}
          </p>
        </div>
      );
    } else if (balance > 0) {
      return (
        <div className={classes}>
          <p className="">You are owed</p>
          <p className="text-lg font-semibold">
            {balance} {group.currency}
          </p>
        </div>
      );
    }
    return (
      <div className={classes}>
        <p className="justify-self-end text-lg">You are settled up!</p>
      </div>
    );
  };

  return (
    <Link to={groupUrl} className="basis-1/4">
      <div className="card bg-base-100 h-full hover:bg-base-200">
        <div className="flex gap-4 items-start">
          <p className="font-normal text-2xl">{group.emoji}</p>
          <h5 className="mb-2 text-xl font-bold">{group.name}</h5>
        </div>

        {BalanceText()}
      </div>
    </Link>
  );
};

export default GroupCard;

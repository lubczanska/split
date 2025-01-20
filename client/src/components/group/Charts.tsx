import * as Api from "../../network/api";
import { useEffect, useState } from "react";
import UserChart from "../charts/UserChart";
import { Group } from "../../models/group";

interface ChartsProps {
  group: Group | null;
  currency?: string;
}

const Charts = ({ group, currency }: ChartsProps) => {
  const [total, setTotal] = useState(0);
  const [categoryTotal, setCategoryTotal] = useState<[string, number][]>([]);
  const [userTotal, setUserTotal] = useState<[string, number][]>([]);
  const [userSpent, setUserSpent] = useState<[string, number][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function getStats() {
      try {
        setLoading(true);

        if (group) {
          const groupId = group._id;
          setError(false);
          const total = await Api.fetchGroupTotal(groupId);
          const categoryTotal = await Api.getGroupCategoryTotal(groupId);
          const UserTotal = await Api.getGroupUserTotal(groupId);
          const Totals = new Map(UserTotal);
          const UserSpent : [string, number][] = Object.entries(group.memberBalance).map(
            ([key, value]) => {
              const total = Totals.get(key) || 0;
              return [key, total - value];
            }
          )
          setTotal(total);
          setCategoryTotal(categoryTotal);
          setUserTotal(UserTotal);
          setUserSpent(UserSpent)
        }
      } catch (error) {
        setError(true);
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getStats();
  }, [group]);

  return loading ? (
    <div className="mx-auto py-20">
      <span className="loading loading-dots loading-lg"></span>
    </div>
  ) : (
    <div className="">
      {error ? (
        <p>:(</p>
      ) : (
        <div className="flex flex-wrap gap-4 justify-around items-start">
          <div className="grow stat card bg-secondary text-primary-content">
            <p className="stat-title text-primary-content">Total spent</p>
            <p className="stat-value">
              {total} {currency}
            </p>
          </div>
          <div className="basis-1/4">
            <h5 className="py-4 font-bold text-lg">
              Total amount paid by User
            </h5>
            <UserChart totals={userTotal} currency={currency} />
          </div>
          <div className="basis-1/4">
            <h5 className="py-4 font-bold text-lg">
              Total amount spent by User
            </h5>
            <UserChart totals={userSpent} currency={currency} />
          </div>
          <div className="basis-1/4">
            <h5 className="py-4 font-bold text-lg">
              Total amount spent by Category
            </h5>
            <UserChart totals={categoryTotal} currency={currency} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Charts;

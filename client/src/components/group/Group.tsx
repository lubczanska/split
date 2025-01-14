import { useEffect, useState } from "react";
import { Expense as ExpenseModel } from "../../models/expense";
import { Group as GroupModel } from "../../models/group";
import Expense from "../expense/Expense";
import * as Api from "../../network/api";
import { Link, useNavigate, useParams } from "react-router";
import Button from "../Button";
import configData from "../../config.json";
import Balance from "./Balance";

const Dashboard = () => {
  const params = useParams();
  const [group, setGroup] = useState<GroupModel | null>(null);
  const [expenses, setExpenses] = useState<ExpenseModel[]>([]);
  const [expensesLoading, setExpensesLoading] = useState(true);
  const [error, setError] = useState(false);
  const [settlements, setSettlements] = useState<
    [string, string, number][] | null
  >(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function getGroup() {
      try {
        setError(false);
        setExpensesLoading(true);
        const groupId = params.groupId?.replace(":groupId", "");
        if (groupId) {
          const expenses = await Api.fetchGroupExpenses(groupId);
          setExpenses(expenses);
          const group = await Api.fetchGroup(groupId);
          setGroup(group);
        } else {
          navigate(configData.DASHBOARD_URL);
        }
      } catch (error) {
        setError(true);
        console.error(error);
        alert(error);
      } finally {
        setExpensesLoading(false);
      }
    }
    getGroup();
  }, [navigate, params.groupId]);

  async function deleteExpense(expense: ExpenseModel) {
    try {
      await Api.deleteExpense(expense._id);
      setExpenses(expenses.filter((e) => e._id !== expense._id));
      if (group) {
        const newGroup = await Api.fetchGroup(group._id);
        setGroup(newGroup);
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  async function deleteGroup(groupId: string) {
    try {
      await Api.deleteGroup(groupId);
      navigate(configData.DASHBOARD_URL);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  async function settle() {
    console.log("settling debts...");
    if (group) {
      const res = await Api.fetchGroupSettlement(group._id);
      setSettlements(res);
      console.log(res);
    }
  }

  const expenseGrid = (
    <div className="flow-root">
      <ul role="list" className="divide-y divide-gray-200 ">
        {expenses.map((expense) => (
          <Expense
            expense={expense}
            currency={group ? group?.currency : ""}
            key={expense._id}
            OnExpenseClicked={() => console.log(expense)}
            OnDeleteClicked={(expense) => deleteExpense(expense)}
          />
        ))}
      </ul>
    </div>
  );

  const balances = (
    <div className="flow-root">
      <ul role="list" className="divide-y divide-gray-200 ">
        {group &&
          group.members.map((member) => (
            <Balance
              key={member.name}
              member={member.name}
              balance={group.memberBalance[member.name]}
              currency={group ? group?.currency : ""}
            />
          ))}
      </ul>
    </div>
  );
  return (
    <div>
      <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 ">
        <div className="flex justify-between gap-5 mb-4">
          <div className="flex gap-5">
            <h2 className="text-xl font-bold leading-none text-gray-900">
              {group?.emoji}
            </h2>
            <h2 className="text-xl font-bold leading-none text-gray-900">
              {group?.name}
            </h2>
          </div>
          <button
            onClick={(e) => {
              if (group) deleteGroup(group._id);
              e.stopPropagation();
            }}
            className="justify-self-end text-base font-semibold text-red-500 hover:text-white "
          >
            DELETE
          </button>
        </div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <h5 className="text-lg font-bold leading-none text-gray-900">
            Your expenses
          </h5>
          <Link to={configData.ADD_EXPENSE_URL + group?._id}>
            <Button type="button" label="Add expense" />
          </Link>
        </div>
        {expensesLoading && <p className="text-white"> Loading...</p>}
        {error && <p className="text-white">Something went wrong :( </p>}
        {!expensesLoading && !error && (
          <>
            {" "}
            {expenses.length > 0 ? (
              expenseGrid
            ) : (
              <p className="text-white">Looks empty in here</p>
            )}
          </>
        )}
        <h6 className="text-lg font-bold leading-none text-gray-900 py-6">
          Balances
        </h6>
        {balances}
        <Button label="get Settlements" onClick={settle} />
        {settlements &&
          settlements.map(([from, to, amt]) => (
            <p>{`${from} -> ${to} : ${amt}`} </p>
          ))}
      </div>
    </div>
  );
};

export default Dashboard;

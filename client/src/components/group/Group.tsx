import { useEffect, useState } from "react";
import { Expense as ExpenseModel } from "../../models/expense";
import { Group as GroupModel } from "../../models/group";
import { User as UserModel } from "../../models/user";
import Expense from "../expense/Expense";
import * as Api from "../../network/api";
import { Link, useNavigate, useParams } from "react-router";
import Button from "../Button";
import configData from "../../config.json";
import Balance from "./Balance";
import ErrorAlert from "../ErrorAlert";

const Group = () => {
  const params = useParams();
  const [loggedInUser, setLoggedInUser] = useState<UserModel | null>(null);
  const [group, setGroup] = useState<GroupModel | null>(null);
  const [expenses, setExpenses] = useState<ExpenseModel[]>([]);
  const [expensesLoading, setExpensesLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [settlements, setSettlements] = useState<
    [string, string, number][] | null
  >(null);
  const [reload, setReload] = useState(false)

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
          const user = await Api.getLoggedInUser();
          if (user) {
            setLoggedInUser(user);
          }
        } else {
          navigate(configData.DASHBOARD_URL);
        }
      } catch (error) {
        setError(true);
        console.error(error);
        alert(error);
      } finally {
        setExpensesLoading(false);
        setReload(false)
      }
    }
    getGroup();
  }, [navigate, params.groupId, reload]);

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

  async function getSettlements() {
    if (group) {
      const res = await Api.fetchGroupSettlement(group._id);
      setSettlements(res);
    }
  }

  async function settleDebt(from: string, to: string, amount: number) {
    try {
      amount = Number(amount);
      const input: Api.ExpenseInput = {
        name: "transfer",
        amount: amount,
        paidBy: from,
        date: new Date().toISOString().split("T")[0],
        category: "Transfer",
        members: [to],
        costSplit: Object.fromEntries([[to, amount]]),
      };
      if (group) {
        const expense = await Api.createExpense(group._id, input);
        setExpenses([...expenses, expense]);
        if (group) {
          const newGroup = await Api.fetchGroup(group._id);
          setGroup(newGroup);
        }
        //reload properly
      }
    } catch (error) {
      if (error instanceof Error) setErrorText(error.message);
      else alert(error);
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
      <div className="p-4 bg-white border border-black rounded-lg sm:p-8 ">
        <div className="flex justify-between gap-5 mb-4">
          {errorText && <ErrorAlert text={errorText} />}
          <div className="flex gap-5 py-4">
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
            DELETE GROUP
          </button>
          <Link to={configData.EDIT_GROUP_URL + group?._id}>
            <button className="justify-self-end text-base font-semibold  hover:text-white ">
              EDIT GROUP
            </button>
          </Link>
        </div>
        <div className="flex justify-around">
          <div className="flex flex-col items-center justify-start gap-4 mb-4 border border-black rounded-xl p-6 w-1/2">
            <div className="flex items-center justify-between gap-4">
              <h5 className="text-lg font-bold leading-none text-gray-900">
                Your expenses
              </h5>
              <Link to={configData.ADD_EXPENSE_URL + group?._id}>
                <Button type="button" label="Add expense" />
              </Link>
              <Link to={configData.ADD_TRANSFER_URL + group?._id}>
                <Button type="button" label="Add transfer" />
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
          </div>
          <div className="border border-black rounded-xl p-6 w-1/3">
            {settlements ? (
              <div>
                {" "}
                <h6 className="text-lg font-bold leading-none text-gray-900 py-6">
                  Suggested Reimbursements
                </h6>
                <div className={"mb-4 bg-yellow-300 rounded-full"}>
                  <p>You are owed</p>
                  <p className="font-semibold">
                    {loggedInUser &&
                      group?.memberBalance[loggedInUser.username]}{" "}
                    {group?.currency}
                  </p>
                </div>
                {settlements.map(([from, to, amt]) => (
                  <div className="flex gap-2 py-1">
                    <p className="font-semibold">{from}</p>
                    <p>owes</p>
                    <p className="font-semibold">{to} </p>
                    <p className="">
                      {amt} {group?.currency}{" "}
                    </p>
                    <Button
                      label="Settle"
                      onClick={(e: { stopPropagation: () => void; }) => {
                        e.stopPropagation();
                        settleDebt(from, to, amt);
                      }}
                    />
                  </div>
                ))}
                <Button label="Balances" onClick={() => setSettlements(null)} />
              </div>
            ) : (
              <div>
                <h6 className="text-lg font-bold leading-none text-gray-900 py-6">
                  Balances
                </h6>
                {balances}
                <Button label="get Settlements" onClick={getSettlements} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Group;

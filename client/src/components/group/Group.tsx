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
  const [reload, setReload] = useState(false);

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
        setReload(false);
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
    <div className="">
      <ul role="list" className="flex flex-col items-center gap-2 w-xl">
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
    <div className="">
      <ul role="list" className="flex flex-col items-between gap-1 w-xl">
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
      {errorText && <ErrorAlert text={errorText} />}

      <div className="">
        {/* Group header start */}
        <div className="flex justify-between">
          <div className="flex gap-5 py-4">
            <h2 className="text-xl font-bold ">{group?.emoji}</h2>
            <h2 className="text-xl font-bold ">{group?.name}</h2>
          </div>
          <div className="card-actions">
            <button
              onClick={(e) => {
                if (group) deleteGroup(group._id);
                e.stopPropagation();
              }}
              className="btn btn-outline btn-secondary"
            >
              DELETE GROUP
            </button>
            <Link to={configData.EDIT_GROUP_URL + group?._id}>
              <button className="btn btn-outline btn-secondary">
                EDIT GROUP
              </button>
            </Link>
          </div>
        </div>
        {/* Group header end */}
        <div className="flex justify-around">
          {/* Expenses */}
          <div className="card bg-base-200">
            <div className="flex flex-col gap-4">
              <span className="card-title">Your expenses</span>
              <div className="card-actions">
                <Link to={configData.ADD_EXPENSE_URL + group?._id}>
                  <Button type="button" label="Add expense" />
                </Link>
                <Link to={configData.ADD_TRANSFER_URL + group?._id}>
                  <Button type="button" label="Add transfer" />
                </Link>
              </div>
            </div>
            <div className="card-body">
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
          </div>
          {/* Expenses end */}
          <div className="card bg-base-200">
            {settlements ? (
              <div className="flex flex-col gap-6">
                <div className={"card bg-primary text-primary-content"}>
                  <div className="card-body p-0 m-0">
                    <p>You are owed</p>
                    <p className="font-semibold text-xl">
                      {loggedInUser &&
                        group?.memberBalance[loggedInUser.username]}{" "}
                      {group?.currency}
                    </p>
                  </div>
                </div>
                <span className="card-title">Suggested Reimbursements</span>
                {settlements.map(([from, to, amt]) => (
                  <div className="flex justify-between gap-2 py-1">
                    <div className="flex gap-2">
                    <p className="font-semibold">{from}</p>
                    <p>owes</p>
                    <p className="font-semibold">{to} </p>
                    </div>
                    <p className="">
                      {amt} {group?.currency}{" "}
                    </p>
                    <button
                      className="btn btn-secondary btn-xs justify-end"
                      onClick={(e: { stopPropagation: () => void }) => {
                        e.stopPropagation();
                        settleDebt(from, to, amt);
                      }}
                    >
                      Settle{" "}
                    </button>
                  </div>
                ))}
                <Button label="Balances" onClick={() => setSettlements(null)} />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <span className="card-title">Balances</span>
                <div className="card-actions py-2">
                  <Button label="get Settlements" onClick={getSettlements} />
                </div>
                {balances}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Group;

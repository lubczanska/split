import { useEffect, useRef, useState } from "react";
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
import ViewExpense from "../expense/ViewExpense";
import Settlements from "./Settlements";
import DebtStat from "./DebtStat";
import Charts from "../charts/Charts";
import GroupActions from "./GroupActions";
import ShareGroup from "./shareGroup";

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
  const [myMember, setMyMember] = useState<string | null>(null);
  const [showExpense, setShowExpense] = useState<ExpenseModel | null>(null);
  const expenseRef = useRef<HTMLDialogElement | null>(null);
  const [, setShowShare] = useState(false);
  const shareRef = useRef<HTMLDialogElement | null>(null);

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
            setMyMember(
              group.members.find((m) => m.id == user.username)?.name || null
            );
          }
        } else {
          navigate(configData.DASHBOARD_URL);
        }
      } catch (error) {
        if (error instanceof Error) setErrorText(error.message);
        else alert(error);
      } finally {
        setExpensesLoading(false);
      }
    }
    getGroup();
  }, [navigate, params.groupId]);

  async function syncData() {
    try {
      if (group) {
        const expenses = await Api.fetchGroupExpenses(group._id);
        setExpenses(expenses);
        const newGroup = await Api.fetchGroup(group._id);
        setGroup(newGroup);
        if (settlements) getSettlements();
      }
    } catch (error) {
      if (error instanceof Error) setErrorText(error.message);
      else alert(error);
    }
  }

  async function deleteExpense(expense: ExpenseModel) {
    try {
      await Api.deleteExpense(expense._id);
      setExpenses(expenses.filter((e) => e._id !== expense._id));
      if (group) {
        const newGroup = await Api.fetchGroup(group._id);
        setGroup(newGroup);
        if (settlements) getSettlements();
      }
    } catch (error) {
      if (error instanceof Error) setErrorText(error.message);
      else alert(error);
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
          getSettlements();
        }
      }
    } catch (error) {
      if (error instanceof Error) setErrorText(error.message);
      else alert(error);
    }
  }
  const expenseGrid = (
    <div className="">
      <ul role="list" className="flex flex-col items-center gap-2 w-full">
        {expenses.map((expense) => (
          <Expense
            expense={expense}
            currency={group ? group?.currency : ""}
            key={expense._id}
            OnExpenseClicked={() => {
              if (expenseRef.current) expenseRef.current.showModal();
              setShowExpense(expense);
            }}
            OnDeleteClicked={(expense) => deleteExpense(expense)}
            loggedIn={myMember != null}
          />
        ))}
      </ul>
    </div>
  );

  const balances = (
    <div className="">
      <ul role="list" className="flex flex-col items-between gap-2 w-full">
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

  return expensesLoading ? (
    <div className="mx-auto py-20">
      <span className="loading loading-dots loading-lg"></span>
    </div>
  ) : (
    <div>
      {errorText && <ErrorAlert text={errorText} />}
      <div className="">
        {/* Modals */}
        <dialog id="show_expense_modal" className="modal" ref={expenseRef}>
          <div className="modal-box">
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => {
                  setShowExpense(null);
                  if (expenseRef.current) expenseRef.current.close();
                }}
              >
                ✕
              </button>
            </form>
            <ViewExpense expense={showExpense} currency={group?.currency} />
          </div>
        </dialog>
        <dialog id="show_share_modal" className="modal" ref={shareRef}>
          <div className="modal-box">
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => {
                  setShowShare(false);
                  if (shareRef.current) shareRef.current.close();
                }}
              >
                ✕
              </button>
            </form>
            <ShareGroup
              onCopy={() => {
                setShowShare(false);
                if (shareRef.current) shareRef.current.close();
              }}
              joinLink={
                document.location.origin +
                configData.JOIN_GROUP_URL +
                group?._id
              }
              viewLink={
                document.location.origin +
                configData.VIEW_GROUP_URL +
                group?._id
              }
            />
          </div>
        </dialog>
        {/* Group header start */}
        <div className="flex justify-between pt-2 pb-6 flex-wrap">
          <div className="flex gap-4 py-4 items-end">
            <h2 className="stat-value">{group?.emoji}</h2>
            <h2 className="stat-value">{group?.name}</h2>
          </div>
          <div className="card-actions">
            {group && loggedInUser && (
              <GroupActions
                group={group}
                user={loggedInUser}
                onError={setErrorText}
                onShare={() => {
                  if (shareRef.current) shareRef.current.showModal();
                  setShowShare(true);
                }}
                onSync={syncData}
              />
            )}
          </div>
        </div>
        {/* Group header end */}
        <div className="flex flex-wrap justify-around gap-10">
          {/* Expenses */}
          <div className="card card-compact bg-base-100 grow lg:basis-2/3">
            <div className="flex flex-col gap-4">
              <span className="card-title">Your expenses</span>
              {myMember && (
                <div className="card-actions gap-4">
                  <Link to={configData.ADD_EXPENSE_URL + group?._id}>
                    <Button type="button" label="Add expense" />
                  </Link>
                  <Link to={configData.ADD_TRANSFER_URL + group?._id}>
                    <Button type="button" label="Add transfer" />
                  </Link>
                </div>
              )}
            </div>
            <div className="py-4">
              {expensesLoading && (
                <div className="mx-auto py-20">
                  <span className="loading loading-dots loading-lg"></span>
                </div>
              )}
              {error && <p>Something went wrong :( </p>}
              {!expensesLoading && !error && (
                <>
                  {" "}
                  {expenses.length > 0 ? (
                    expenseGrid
                  ) : (
                    <p>Looks empty in here</p>
                  )}
                </>
              )}
            </div>
          </div>
          {/* Expenses end */}
          <div className="card bg-base-100 grow basis-1/4">
            {/* Debt stat */}
            {myMember ? (
              <DebtStat
                debt={loggedInUser ? group?.memberBalance[myMember] : 0}
                currency={group?.currency}
                onClick={getSettlements}
                showButton={!settlements}
              />
            ) : (
              <div className={"stats text-primary-content mb-4 bg-neutral"}>
                <div className="stat">
                  <div className="stat-actions">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={getSettlements}
                    >
                      see all debts
                    </button>
                  </div>
                </div>
              </div>
            )}

            {settlements ? (
              <div>
                <Settlements
                  settlements={settlements}
                  currency={group?.currency}
                  settleDebt={settleDebt}
                  loggedIn={myMember != null}
                />
                <button
                  className="btn btn-circle my-8"
                  onClick={() => setSettlements(null)}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <span className="card-title">Balances</span>
                {balances}
              </div>
            )}
          </div>
          <div className="card bg-base-100 grow">
            <Charts group={group} currency={group?.currency} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Group;

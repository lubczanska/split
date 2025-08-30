import { useForm } from "react-hook-form";
import { Group as GroupModel } from "../../models/group";
import TextInputField from "../form/TextInputField";
import SelectField from "../form/SelectField";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import * as Api from "../../network/api";
import configData from "../../config.json";
import { ExpenseInput } from "../../network/api";
import ErrorAlert from "../ErrorAlert";
import { CATEGORIES } from "../../util/helper";
import { evaluate } from "mathjs";

const AddExpense = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [group, setGroup] = useState<GroupModel | null>(null);
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [participants, setParticipants] = useState<boolean[]>([]);
  const [equal, setEqual] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);

  interface ExpenseFormInput {
    // different from expense input because of math expression parsing
    name: string;
    amount: string;
    date: string;
    category: string;
    paidBy: string;
    members: string[];
    costSplit: Record<string, string>;
  }

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormInput>({
    defaultValues: { date: new Date().toISOString().split("T")[0] },
  });

  useEffect(() => {
    async function getGroup() {
      const groupId = params.groupId?.replace(":groupId", "");
      if (groupId) {
        const group = await Api.fetchGroup(groupId);
        setGroup(group);
        setGroupMembers(group.members.map((m) => m.name));
        const newParticipants = new Array<boolean>(group.members.length).fill(
          true
        );
        setParticipants(newParticipants);
        setValue("paidBy", groupMembers[0]);
      }
    }
    getGroup();
  }, [params.groupId, navigate, setValue]);

  const changeParticipant = (position: number) => {
    const nextParticipants = participants.map((item, index) =>
      position == index ? !item : item
    );
    setParticipants(nextParticipants);
    if (equal) splitEqually(nextParticipants.filter(Boolean).length, position);
  };

  /*
  set participant amounts to an equal share 
  */
  const splitEqually = (cnt?: number, pos?: number) => {
    const count = cnt ? cnt : participants.filter(Boolean).length;
    const res =
      Math.round(
        (evaluate(getValues("amount")) / count + Number.EPSILON) * 100
      ) / 100;
    participants.forEach((selected, index) => {
      if (selected || index == pos)
        setValue(`costSplit.${groupMembers[index]}`, String(res));
    });
  };

  async function onSubmit(input: ExpenseFormInput) {
    try {
      input.members = groupMembers.filter((_p, i) => participants[i]);
      const amount = evaluate(input.amount);
      const split = Object.entries(input.costSplit)
        .filter((key) => input.members.includes(key[0]))
        .map((key) => [key[0], evaluate(key[1])]);

      const total = split.reduce((acc, curr) => acc + Number(curr[1]), 0);
      if (!equal && total != amount)
        throw Error("Split has to sum up to amount");

      const expense: ExpenseInput = {
        name: input.name,
        amount: total, // ignore uneven splitting errors, people don't care about cents
        date: input.date,
        category: input.category,
        paidBy: input.paidBy,
        members: input.members,
        costSplit: Object.fromEntries(split),
      };

      if (group) {
        await Api.createExpense(group._id, expense);
        navigate(configData.VIEW_GROUP_URL + group._id);
      }
    } catch (error) {
      if (error instanceof Error) setErrorText(error.message);
      else alert(error);
    }
  }

  return (
    <div>
      {errorText && <ErrorAlert text={errorText} />}
      <form
        className="card md:w-2/3 mx-auto card-bordered bg-base-200 card-compact md:card-normal"
        id="addExpenseForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex justify-between">
          <h5 className="card-title">Add Expense</h5>
          <button className="btn btn-circle" onClick={() => navigate(-1)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap">
          <TextInputField
            name="name"
            label="Name"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.name}
          />
          <SelectField
            name="category"
            label="Category"
            selected={{ value: "Others", label: "💵  Other" }}
            options={CATEGORIES}
            defaultVal={groupMembers[0]}
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.category}
          />
        </div>

        <div className="flex flex-wrap">
          <TextInputField
            name="amount"
            label="Amount"
            register={register}
            registerOptions={{
              required: "Required",
              // replace pattern with parsing a simple math equation function that throws "invalid amount calculation" on parse error
              pattern: {
                value:
                  /(^[\d]+([.][\d]{1,2})?)([+\-*/][\d]+([.][\d]{1,2})?)*/gm,
                message: "Impossible amount of money",
              },
              validate: {
                positive: (v) => evaluate(v) >= 0,
              },
              onChange: () => {
                if (equal) splitEqually();
              },
            }}
            error={errors.amount}
          />
          <TextInputField
            name="date"
            label="Date"
            type="date"
            datepicker="true"
            datepicker-buttons="true"
            datepicker-autoselect-today="true"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.date}
          />
        </div>
        <SelectField
          name="paidBy"
          label="Paid by"
          selected={{ value: "a", label: "a" }}
          options={groupMembers.map((m) => {
            return { value: m, label: m };
          })}
          defaultVal={groupMembers[0]}
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.paidBy}
        />
        <label className="py-4 self-end inline-flex items-center me-5 cursor-pointer">
          <input
            type="checkbox"
            value=""
            className="toggle toggle-primary"
            checked={equal}
            onChange={() => {
              if (!equal) splitEqually();
              setEqual(!equal);
            }}
          />
          <span className="ms-3 text-sm font-medium text-gray-900\">
            Split Equally
          </span>
        </label>
        <div className="join join-vertical">
          {groupMembers.map((member, index) => {
            return (
              <div
                key={member}
                className=" flex justify-between bg-base-300 join-item p-3 input input-bordered"
              >
                <div className="flex gap-4">
                  <input
                    className="checkbox checkbox-primary"
                    type="checkbox"
                    checked={participants[index]}
                    onChange={() => {
                      changeParticipant(index);
                    }}
                  />
                  <label>{member}</label>
                </div>
                {participants[index] && (
                  <div className=" flex">
                    <input
                      className={
                        "input font-semibold" + equal
                          ? "max-w-20"
                          : "disabled:hidden max-w-20"
                      }
                      placeholder="0"
                      disabled={!participants[index] || equal}
                      id={"participant-" + member}
                      {...register(`costSplit.${member}`, {
                        required: true,
                        pattern: {
                          value:
                            /(^[\d]+([.][\d]{1,2})?)([+\-*/][\d]+([.][\d]{1,2})?)*/gm,
                          message: "Impossible amount of money",
                        },
                        validate: {
                          positive: (v: string) =>
                            !participants[index] || evaluate(v) >= 0,
                        },
                      })}
                    />

                    <p className="font-semibold"> {group?.currency} </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="card-actions">
          <button
            type="submit"
            form="addExpenseForm"
            className="btn btn-primary my-2 w-full"
            disabled={isSubmitting}
          >
            Add Expense
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;

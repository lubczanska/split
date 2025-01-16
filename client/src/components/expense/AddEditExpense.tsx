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

const AddExpense = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [group, setGroup] = useState<GroupModel | null>(null);
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [participants, setParticipants] = useState<boolean[]>([]);
  const [equal, setEqual] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);

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
      }
    }
    getGroup();
  }, [params.groupId, navigate]);
  const changeParticipant = (position: number) => {
    const nextParticipants = participants.map((item, index) =>
      position === index ? !item : item
    );

    setParticipants(nextParticipants);
  };

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseInput>({
    defaultValues: { date: new Date().toISOString().split("T")[0] },
  });

  const splitEqually = () => {
    const count = participants.filter(Boolean).length;
    const res =
      Math.round((getValues("amount") / count + Number.EPSILON) * 100) / 100;
    participants.forEach((selected, index) => {
      if (selected) setValue(`costSplit.${groupMembers[index]}`, res);
    });
  };

  async function onSubmit(input: ExpenseInput) {
    try {
      input.members = groupMembers.filter((_p, i) => participants[i]);
      input.amount = Number(input.amount);
      const split = Object.entries(input.costSplit)
        .filter((key) => input.members.includes(key[0]))
        .map((key) => [key[0], Number(key[1])]);

      const total = split.reduce((acc, curr) => acc + Number(curr[1]), 0);
      if (!equal && total != input.amount)
        throw Error("Split has to sum up to amount");

      input.costSplit = Object.fromEntries(split);
      console.log(input);
      if (group) {
        await Api.createExpense(group._id, input);
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
        className="card w-2/3 mx-auto card-bordered bg-base-200"
        id="addExpenseForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h5 className="card-title">Add Expense</h5>
        <div className="flex gap-20">
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
          options={[{ value: "Others", label: "💵  Other" },
            { value: "Transport", label: "🚗  Transport" },
            { value: "Food", label: "🍕  Food" },
            { value: "Shopping", label:  "🛍️ Shopping" },
            { value: "Entertainment", label:  "🛍️ Entertainment" }]}
          defaultVal={groupMembers[0]}
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.category}
        />
        </div>

        <div className="flex gap-20">
          <TextInputField
            name="amount"
            label="Amount"
            register={register}
            registerOptions={{
              required: "Required",
              pattern: {
                value: /^\d+(?:\.\d{1,2})?$/gm,
                message: "Impossible amount of money",
              },
              validate: {
                positive: (v) => Number(v) >= 0,
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
                          value: /^\d+(?:\.\d{1,2})?$/gm,
                          message: "Impossible amount of money",
                        },
                        validate: {
                          positive: (v) =>
                            !participants[index] || Number(v) >= 0,
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
            className="btn btn-primary my-2"
            disabled={isSubmitting}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;

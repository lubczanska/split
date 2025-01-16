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
        className="max-w-sm mx-auto border border-black rounded-xl p-8"
        id="addExpenseForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h5 className="text-2xl font-bold pb-6">Add Expense</h5>
        <TextInputField
          name="name"
          label="Name"
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.name}
        />
        <div className="flex gap-4">
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
            className="sr-only peer"
            checked={equal}
            onChange={() => {
              if (!equal) splitEqually();
              setEqual(!equal);
            }}
          />
          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-200 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
          <span className="ms-3 text-sm font-medium text-gray-900\">
            Split Equally
          </span>
        </label>
        <div className="my-4 border border-black empty:border-0 rounded-lg bg-white">
          {groupMembers.map((member, index) => {
            return (
              <div
                key={member}
                className=" border-b border-black last:border-0 section flex justify-around gap-3 text-black text-sm  block w-full p-2.5 d"
              >
                <div className="flex gap-3 w-64">
                  <input
                    className="flex-start w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    type="checkbox"
                    checked={participants[index]}
                    onChange={() => {
                      changeParticipant(index);
                    }}
                  />
                  <label>{member}</label>
                </div>
                {participants[index] && (
                  <div className="w-32 flex">
                    <input
                      className={equal ? "w-20" : "disabled:hidden w-20"}
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

                    <p> {group?.currency} </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          form="addExpenseForm"
          className="text-black bg-green-300 border border-black hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-sm px-5  w-full py-2.5 text-center me-2 mb-2 "
          disabled={isSubmitting}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddExpense;

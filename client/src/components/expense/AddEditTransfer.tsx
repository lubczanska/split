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

interface TransferInput {
  from: string;
  to: string;
  amount: number;
  date: string;
}

const AddEditTransfer = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [group, setGroup] = useState<GroupModel | null>(null);
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [errorText, setErrorText] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransferInput>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    async function getGroup() {
      const groupId = params.groupId?.replace(":groupId", "");
      if (groupId) {
        const group = await Api.fetchGroup(groupId);
        setGroup(group);
        setGroupMembers(group.members.map((m) => m.name));
        setValue("from", groupMembers[0]);
        setValue("to", groupMembers[1]);
      }
    }
    getGroup();
  }, [params.groupId, navigate, setValue, groupMembers]);

  async function onSubmit(input: TransferInput) {
    try {
      if (input.from === input.to)
        throw Error("You cannot transfer to yourself");

      input.amount = Number(input.amount);
      const newInput: ExpenseInput = {
        name: "transfer",
        amount: input.amount,
        paidBy: input.from,
        date: input.date,
        category: "Transfer",
        members: [input.to],
        costSplit: Object.fromEntries([[input.to, input.amount]]),
      };
      if (group) {
        await Api.createExpense(group._id, newInput);
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
        id="addTransferForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex justify-between">
          <h5 className="card-title">Add Transfer</h5>
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
        <SelectField
          name="from"
          label="From"
          options={groupMembers.map((m) => {
            return { value: m, label: m };
          })}
          defaultVal={groupMembers[0]}
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.from}
        />
        <SelectField
          name="to"
          label="To"
          options={groupMembers.map((m) => {
            return { value: m, label: m };
          })}
          defaultVal={groupMembers[1]}
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.to}
        />
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

        <button
          type="submit"
          form="addTransferForm"
          className="btn btn-primary my-2"
          disabled={isSubmitting}
        >
          Add Transfer
        </button>
      </form>
    </div>
  );
};

export default AddEditTransfer;

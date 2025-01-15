import { useForm } from "react-hook-form";
import { Group as GroupModel } from "../../models/group";
import TextInputField from "../form/TextInputField";
import SelectField from "../form/SelectField";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import * as Api from "../../network/api";
import configData from "../../config.json";
import { ExpenseInput } from "../../network/api";

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

  useEffect(() => {
    async function getGroup() {
      const groupId = params.groupId?.replace(":groupId", "");
      if (groupId) {
        const group = await Api.fetchGroup(groupId);
        setGroup(group);
        setGroupMembers(group.members.map((m) => m.name));
      }
    }
    getGroup();
  }, [params.groupId, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TransferInput>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
    },
  });

  async function onSubmit(input: TransferInput) {
    try {
      if (input.from === input.to) {
        alert("cannot transfer to yourself");
        return;
      }
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
      console.error(error);
      alert(error);
    }
  }
  return (
    <div>
      <form
        className="max-w-sm mx-auto"
        id="addTransferForm"
        onSubmit={handleSubmit(onSubmit)}
      >
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
          className="text-black bg-green-300 border border-black hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
          disabled={isSubmitting}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddEditTransfer;

import { useFieldArray, useForm } from "react-hook-form";
import { createGroup, GroupInput } from "../../network/api";
import SelectField from "../form/SelectField";
import TextInputField from "../form/TextInputField";
import Button from "../Button";
import { useNavigate } from "react-router";
import configData from "../../config.json"

const AddGroup = () => {
    const navigate=useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GroupInput>({ defaultValues: { members: [{name: ""}] } });

  const { fields, append, remove } = useFieldArray({
    name: "members",
    control,
  });

  const onSubmit = async (group: GroupInput) => {
    const createResponse = await createGroup(group);
    navigate(configData.VIEW_GROUP_URL+createResponse._id)
  };

  return (
    <div>
      <form
        className="max-w-sm mx-auto"
        id="addGroupForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInputField
          name="name"
          label="name"
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.name}
        />
        <SelectField
          name="emoji"
          label="emoji"
          selected={{ value: "🙂", label: "🙂" }}
          options={[
            { value: "💵", label: "💵" },
            { value: "💩", label: "💩" },
            { value: "💀", label: "💀" },
          ]}
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.emoji}
        />
        <SelectField
          name="currency"
          label="currency"
          selected={{ value: "PLN", label: "Polish Zloty" }}
          options={[
            { value: "EUR", label: "Euro" },
            { value: "USD", label: "US Dollar" },
            { value: "GBP", label: "British Pound" },
            { value: "CZK", label: "Czech Koruna" },
          ]}
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.currency}
        />
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Members
        </label>
        <div className="border border-black empty:border-0 rounded-lg bg-white">
          {fields.map((field, index) => {
            return (
              <div
                key={field.id}
                className=" border-b border-black last:border-0"
              >
                <section
                  className={
                    "section flex gap-3 text-black text-sm  block w-full p-2.5 d"
                  }
                  key={field.id}
                >
                  <input
                    placeholder="name"
                    {...register(`members.${index}.name` as const, {
                      required: true,
                    })}
                    className={
                      "focus:ring-green-500 focus:border-green-500" +
                      errors?.members?.[index]?.name
                        ? "error"
                        : ""
                    }
                  />
                  <button
                    type="button"
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    x
                  </button>
                </section>
              </div>
            );
          })}
        </div>
        <Button
          type="button"
          label="Add member"
          onClick={() => append({ name: "" })}
        />

        <div className="flex items-center justify-center mb-5">
          <Button type="submit" label="Create Group" disabled={isSubmitting} />
        </div>
      </form>
    </div>
  );
};
export default AddGroup;

import { useFieldArray, useForm } from "react-hook-form";
import { createGroup, GroupInput } from "../../network/api";
import SelectField from "../form/SelectField";
import TextInputField from "../form/TextInputField";
import Button from "../Button";
import { useLocation, useNavigate } from "react-router";
import configData from "../../config.json";
import { useState } from "react";
import ErrorAlert from "../ErrorAlert";

const AddGroup = () => {
  const [errorText, setErrorText] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GroupInput>({ defaultValues: { members: [{ name: "" }] } });

  const { fields, append, remove } = useFieldArray({
    name: "members",
    control,
  });

  const onSubmit = async (group: GroupInput) => {
    try {
      group.members.unshift({ name: location.state.user.username });
      // unique member names validation
      const members = group.members.map((a) => a.name);
      if (members.length !== new Set(members).size)
        throw Error("Every member needs a unique name");

      const createResponse = await createGroup(group);
      navigate(configData.VIEW_GROUP_URL + createResponse._id);
    } catch (error) {
      if (error instanceof Error) setErrorText(error.message);
      else alert(error);
    }
  };

  return (
    <div>
      {errorText && <ErrorAlert text={errorText} />}

      <form
        className="max-w-sm mx-auto border border-black rounded-xl p-8"
        id="addGroupForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h5 className="text-2xl font-bold pb-6">Add Group</h5>
        <div className="flex gap-4 justify-around">
          <TextInputField
            name="name"
            label="Name"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.name}
          />
          <SelectField
            name="emoji"
            label="Emoji"
            options={[
              { value: "🙂", label: "🙂" },
              { value: "💵", label: "💵" },
              { value: "💩", label: "💩" },
              { value: "💀", label: "💀" },
            ]}
            defaultVal="🙂"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.emoji}
          />
        </div>
        <SelectField
          name="currency"
          label="Currency"
          options={[
            { value: "PLN", label: "Polish Zloty" },
            { value: "EUR", label: "Euro" },
            { value: "USD", label: "US Dollar" },
            { value: "GBP", label: "British Pound" },
            { value: "CZK", label: "Czech Koruna" },
          ]}
          defaultVal="PLN"
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.currency}
        />
        <label className="block mb-2 text-sm font-medium pt-2">Members</label>
        <div className="border border-black empty:border-0 rounded-lg bg-white">
          <div className=" border-b border-black last:border-0">
            <section
              className={
                "section flex gap-3 text-black text-sm  block w-full p-2.5 d"
              }
            >
              <input
                placeholder="name"
                disabled
                readOnly
                value={location.state.user.username}
                className={"focus:ring-green-500 focus:border-green-500 px-2"}
              />
            </section>
          </div>
          {fields.map((field, index) => {
            return (
              <div
                key={field.id}
                className=" border-b border-black last:border-0"
              >
                <section
                  className={
                    "section flex justify-between gap-3 text-black text-sm  block w-full py-2.5 px-4 d"
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

        <button
          type="submit"
          form="addGroupForm"
          className="text-black bg-green-300 border border-black hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-sm px-5  w-full py-2.5 text-center me-2 mb-2 mt-4"
          disabled={isSubmitting}
        >
          Create Group
        </button>
      </form>
    </div>
  );
};
export default AddGroup;

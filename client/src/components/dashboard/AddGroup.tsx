import { useFieldArray, useForm } from "react-hook-form";
import { createGroup, GroupInput } from "../../network/api";
import SelectField from "../form/SelectField";
import TextInputField from "../form/TextInputField";
import Button from "../Button";
import { useLocation, useNavigate } from "react-router";
import configData from "../../config.json";
import { useState } from "react";
import ErrorAlert from "../ErrorAlert";
import { CURRENCIES, EMOJI } from "../../util/helper";

const AddGroup = () => {
  const [errorText, setErrorText] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GroupInput>({
    defaultValues: {
      members: [
        {
          name: location.state.user.username,
          id: location.state.user.username,
        },
        {
          name: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "members",
    control,
  });

  const onSubmit = async (group: GroupInput) => {
    try {
      // group.members.unshift({ name: location.state.user.username });
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
    <div className="card md:w-2/3 mx-auto card-bordered bg-base-200 card-compact md:card-normal">
      {errorText && <ErrorAlert text={errorText} />}

      <form
        className="card-body "
        id="addGroupForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex justify-between">
          <h5 className="card-title">Add Group</h5>
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
        <div className="flex flex-wrap ">
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
            options={EMOJI}
            defaultVal="🙂"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.emoji}
          />
        </div>
        <SelectField
          name="currency"
          label="Currency"
          options={CURRENCIES}
          defaultVal="PLN"
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.currency}
        />
        <label className="label">Members</label>

        <div className="join join-vertical">
          {fields.map((field, index) => {
            return index == 0 ? (
              <div className="join-item input input-bordered ">
                <div className="flex items-center justify-between">
                  <input
                    placeholder="owner"
                    {...register(`members.0.name` as const, {
                      required: true,
                    })}
                    defaultValue={location.state.user.username}
                    className={"input input-ghosted px-0 "}
                  />
                  <div className="badge badge-primary">
                    @{location.state.user.username}
                  </div>
                </div>
              </div>
            ) : (
              <div key={field.id} className="join-item input input-bordered ">
                <div className="flex items-center justify-between">
                  <input
                    className={"input input-ghosted px-0 "}
                    placeholder="name"
                    {...register(`members.${index}.name` as const, {
                      required: true,
                    })}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm "
                    onClick={() => {
                      remove(index);
                    }}
                  >
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
          className="btn btn-primary my-8"
          disabled={isSubmitting}
        >
          Create Group
        </button>
      </form>
    </div>
  );
};
export default AddGroup;

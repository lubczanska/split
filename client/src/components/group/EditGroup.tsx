import { useFieldArray, useForm } from "react-hook-form";
import { GroupInput } from "../../network/api";
import SelectField from "../form/SelectField";
import TextInputField from "../form/TextInputField";
import Button from "../Button";
import { useNavigate, useParams } from "react-router";
import configData from "../../config.json";
import { useEffect, useState } from "react";
import { Group as GroupModel } from "../../models/group";
import * as Api from "../../network/api";
import ErrorAlert from "../ErrorAlert";
import { EMOJI } from "../../util/helper";

const EditGroup = () => {
  const [errorText, setErrorText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<GroupModel | null>(null);

  const params = useParams();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GroupInput>({
    defaultValues: {
      members: group?.members,
      name: group?.name,
      emoji: group?.emoji,
    },
  });

  useEffect(() => {
    async function getGroup() {
      try {
        setLoading(true);
        const groupId = params.groupId?.replace(":groupId", "");
        if (groupId) {
          const group = await Api.fetchGroup(groupId);
          setGroup(group);
          setValue("emoji", group.emoji);
          setValue("name", group.name);
          setValue("members", group.members);
        } else {
          navigate(configData.DASHBOARD_URL);
        }
      } catch (error) {
        console.error(error);
        alert(error);
      } finally {
        setLoading(false);
      }
    }
    getGroup();
  }, [navigate, params.groupId, setValue]);

  const { fields, append, remove } = useFieldArray({
    name: "members",
    control,
  });

  const onSubmit = async (input: GroupInput) => {
    try {
      // unique member names validation
      const members = input.members.map((a) => a.name);
      if (members.length !== new Set(members).size)
        throw Error("Every member needs a unique name");
      if (group) {
        const editResponse = await Api.updateGroup(group?._id, input);
        navigate(configData.VIEW_GROUP_URL + editResponse._id);
      }
    } catch (error) {
      if (error instanceof Error) setErrorText(error.message);
      else alert(error);
    }
  };

  return loading ? (
    <div className="mx-auto py-20">
      <span className="loading loading-dots loading-lg"></span>
    </div>
  ) : (
    <div className="card md:w-2/3  mx-auto card-bordered bg-base-200 card-compact md:card-normal">
      {errorText && <ErrorAlert text={errorText} />}
      <form
        className="card-body"
        id="editGroupForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex justify-between">
          <h5 className="card-title">Edit Group</h5>
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
            name="emoji"
            label="Emoji"
            options={EMOJI}
            defaultVal="🙂"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.emoji}
          />
        </div>
        <label className="label">Members</label>
        <div className="join join-vertical">
          {fields.map((field, index) => {
            return (
              <div key={field.id} className="join-item input input-bordered ">
                {group && index < group?.members.length ? (
                  <div className="flex items-center justify-between w-full">
                    <input
                      className="input px-0"
                      placeholder="name"
                      {...register(`members.${index}.name` as const, {
                        required: true,
                      })}
                      readOnly
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <input
                      placeholder="name"
                      {...register(`members.${index}.name` as const, {
                        required: true,
                      })}
                      className="input px-0"
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
                )}
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
          form="editGroupForm"
          className="btn btn-primary my-8"
          disabled={isSubmitting}
        >
          Update Group
        </button>
      </form>
    </div>
  );
};
export default EditGroup;

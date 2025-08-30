import { useForm } from "react-hook-form";
import { LogInCredentials } from "../../network/api";
import * as UsersApi from "../../network/api";
import { User as UserModel } from "../../models/user";
import TextInputField from "../form/TextInputField";
import { useState, ReactElement } from "react";
import ErrorAlert from "../ErrorAlert";

interface LogInProps {
  onLogInSuccessful: (user: UserModel) => void;
  otherButton: ReactElement;
}

const LogInForm = ({ onLogInSuccessful, otherButton }: LogInProps) => {
  const [errorText, setErrorText] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LogInCredentials>();

  async function onLogIn(credentials: LogInCredentials) {
    try {
      const user = await UsersApi.logIn(credentials);
      onLogInSuccessful(user);
    } catch (error) {
      if (error instanceof Error) setErrorText(error.message);
      else alert(error);
    }
  }

  return (
    <div className="card md:w-2/3 mx-auto card-bordered bg-base-200 card-compact md:card-normal">
      {errorText && <ErrorAlert text={errorText} />}
      <form
        className="card-body"
        id="logInForm"
        onSubmit={handleSubmit(onLogIn)}
      >
        <div className="flex justify-between">
          <h5 className="card-title">Log In</h5>
        </div>
        <TextInputField
          name="username"
          label="Username"
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.username}
        />
        <TextInputField
          name="password"
          label="Password"
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.password}
        />
        <div className="card-actions py-4">
          <button
            type="submit"
            className="btn w-full btn-primary"
            disabled={isSubmitting}
          >
            Log In{" "}
          </button>
          {otherButton}
        </div>
      </form>
    </div>
  );
};

export default LogInForm;

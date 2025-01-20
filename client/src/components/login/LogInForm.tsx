import { useForm } from "react-hook-form";
import { LogInCredentials } from "../../network/api";
import * as UsersApi from "../../network/api";
import { User as UserModel } from "../../models/user";
import TextInputField from "../form/TextInputField";
import Button from "../Button";
import { useState } from "react";
import ErrorAlert from "../ErrorAlert";
import { useNavigate } from "react-router";

interface LogInProps {
  onLogInSuccessful: (user: UserModel) => void;
}

const LogInForm = ({ onLogInSuccessful }: LogInProps) => {
    const [errorText, setErrorText] = useState<string | null>(null);
    const navigate = useNavigate();
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
        <div className="flex items-center mb-5">
          <Button type="submit" label="Log In" disabled={isSubmitting} />
        </div>
    </form>
    </div>
  );
};

export default LogInForm;

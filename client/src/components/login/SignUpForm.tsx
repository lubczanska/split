import { useForm } from "react-hook-form";
import { User as UserModel } from "../../models/user";
import { SignUpCredentials } from "../../network/api";
import * as UsersApi from "../../network/api";
import TextInputField from "../form/TextInputField";
import { ReactElement, useState } from "react";
import ErrorAlert from "../ErrorAlert";

interface SignUpProps {
  onSignUpSuccessful: (user: UserModel) => void;
  otherButton: ReactElement;
}

const SignUpForm = ({ onSignUpSuccessful, otherButton }: SignUpProps) => {
  const [errorText, setErrorText] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpCredentials>();

  async function onSignUp(credentials: SignUpCredentials) {
    try {
      const user = await UsersApi.signUp(credentials);
      onSignUpSuccessful(user);
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
        onSubmit={handleSubmit(onSignUp)}
      >
        <div className="flex justify-between">
          <h5 className="card-title">Sign Up</h5>
        </div>
        <TextInputField
          name="username"
          label="Username"
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.username}
        />
        <TextInputField
          name="email"
          label="E-mail"
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.email}
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
            Sign Up{" "}
          </button>
          {otherButton}
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;

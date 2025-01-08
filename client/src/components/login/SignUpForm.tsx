import { useForm } from "react-hook-form";
import { User as UserModel } from "../../models/user";
import { SignUpCredentials } from "../../network/api";
import * as UsersApi from "../../network/api";
import TextInputField from "../form/TextInputField";
import Button from "../Button";

interface SignUpProps {
  onSignUpSuccessful: (user: UserModel) => void;
}

const SignUpForm = ({ onSignUpSuccessful }: SignUpProps) => {
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
      console.error(error);
      alert(error);
    }
  }

  return (
    <form
      className="max-w-sm mx-auto"
      id="logInForm"
      onSubmit={handleSubmit(onSignUp)}
    >
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

      <TextInputField
        name="fullname"
        label="Full Name"
        register={register}
        error={errors.fullname}
      />
      <TextInputField
        name="bio"
        label="Extra information like your account or phone number"
        register={register}
        error={errors.bio}
      />
      <div className="flex items-center mb-5">
        <Button type="submit" label="Sign Up" disabled={isSubmitting} />
      </div>
    </form>
  );
};

export default SignUpForm;

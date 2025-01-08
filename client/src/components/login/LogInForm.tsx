import { useForm } from "react-hook-form";
import { LogInCredentials } from "../../network/api";
import * as UsersApi from "../../network/api";
import { User as UserModel } from "../../models/user";
import TextInputField from "../form/TextInputField";
import Button from "../Button";

interface LogInProps {
  onLogInSuccessful: (user: UserModel) => void;
}

const LogInForm = ({ onLogInSuccessful }: LogInProps) => {
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
      console.error(error);
      alert(error);
    }
  }

  return (
    <form
      className="max-w-sm mx-auto"
      id="logInForm"
      onSubmit={handleSubmit(onLogIn)}
    >
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
  );
};

export default LogInForm;

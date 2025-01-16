import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

interface TextInputFieldProps {
  name: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  error?: FieldError;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}

const TextInputField = ({
  name,
  label,
  register,
  registerOptions,
  error,
  ...props
}: TextInputFieldProps) => {
  return (
    <div className="form-control">
      <label className="label">{label}</label>
      <div className="indicator">
      {error && (
        <span role="alert" className="indicator-item badge badge-error">
          {" "}
          {error.message}{" "}
        </span>
      )}
      <input
        id={name + "-input"}
        type="text"
        className="input input-bordered"
        {...props}
        {...register(name, registerOptions)}
        aria-invalid={error ? "true" : "false"}
      /></div>
    </div>
  );
};

export default TextInputField;

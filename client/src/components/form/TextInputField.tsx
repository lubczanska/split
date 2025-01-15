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
    <div className="py-2">
      <label className="block mb-2 text-sm font-medium ">
        {label}
      </label>
      <input
        id={name + "-input"}
        type="text"
        className="bg-white border border-black text-black text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 d"
        {...props}
        {...register(name, registerOptions)}
        aria-invalid={error ? "true" : "false"}
      />
      {error && <p className="text-red-500" role="alert">{error.message}</p>}
    </div>
  );
};

export default TextInputField;

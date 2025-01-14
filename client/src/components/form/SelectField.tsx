import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

interface SelectFieldProps {
  name: string;
  label: string;
  // selected: { value: string; label: string };
  options: { value: string; label: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  error?: FieldError;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}

const SelectField = ({
  name,
  label,
  options,
  register,
  registerOptions,
  error,
  ...props
}: SelectFieldProps) => {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-black">
        {label}
      </label>
      <select
        id={name + "-select"}
        className="bg-gray-50 border border-black text-black text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 "
        {...props}
        {...register(name, registerOptions)}
      >
        aria-invalid={error ? "true" : "false"}
        {options.map((option, index) => (
          index ? 
          <option  key={option.value} value={option.value}>
            {option.label}
          </option>
          :
          <option  key={option.value} selected={true} value={option.value}>
          {option.label}
        </option>
        ))}
      </select>
      {error && (
        <p className="text-red-500" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default SelectField;

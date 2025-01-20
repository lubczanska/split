import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

interface SelectFieldProps {
  name: string;
  label: string;
  // selected: { value: string; label: string };
  options: { value: string; label: string }[];
  defaultVal: string;
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
  defaultVal,
  registerOptions,
  error,
  ...props
}: SelectFieldProps) => {
  return (
    <div className="form-control md:basis-1/2 grow px-1">
      <label className="label">{label}</label>
      <div className="indicator w-full">
        {error && (
          <span role="alert" className="indicator-item badge badge-error">
            {" "}
            {error.message}{" "}
          </span>
        )}
        <select
          id={name + "-select"}
          // value={defaultVal}
          className="select select-bordered w-full"
          {...props}
          {...register(name, registerOptions)}
        >
          aria-invalid={error ? "true" : "false"}
          {options.map((option) =>
            option.value === defaultVal ? (
              <option key={option.value} value={option.value} selected>
                {option.label}
              </option>
            ) : (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            )
          )}
        </select>
      </div>
    </div>
  );
};

export default SelectField;

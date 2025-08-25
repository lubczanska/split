import { Controller, ControllerProps, useWatch } from "react-hook-form";
interface IConditionalFieldProps extends ControllerProps {
  index: number;
}
const ConditionalField = ({ control, index }: IConditionalFieldProps) => {
  const value = useWatch({
    name: "test",
    control,
  });

  return (
    <Controller
      control={control}
      name={`test.${index}.name`}
      render={({ field }) =>
        value?.[index]?.checkbox === "on" ? <input {...field} /> : <></>
      }
      defaultValue={0}
    />
  );
};
export default ConditionalField;

import { Controller, useWatch } from "react-hook-form";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ConditionalField = ({ control, index, field }) => {
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

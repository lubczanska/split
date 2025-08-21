interface AlertProps {
  text: string;
}
export const InfoAlert = ({ text }: AlertProps) => {
  return (
    <div className={"alert flex justify-center m-2 alert-info"} role="alert">
      <span className="font-medium">{text}</span>
    </div>
  );
};

export const ErrorAlert = ({ text }: AlertProps) => {
  return (
    <div className={"alert flex justify-center m-2 alert-error"} role="alert">
      <span className="font-medium">{text} :(</span>
    </div>
  );
};

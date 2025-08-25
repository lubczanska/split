interface AlertProps {
  text: string;
}

const ErrorAlert = ({ text }: AlertProps) => {
  return (
    <div className={"alert flex justify-center m-2 alert-error"} role="alert">
      <span className="font-medium">{text} :(</span>
    </div>
  );
};

export default ErrorAlert;

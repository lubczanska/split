interface ErrorProps {
  text: string;
}

const ErrorAlert = ({ text }: ErrorProps) => {
  return (
    <div
      className="alert alert-error flex justify-center m-2"
      role="alert"
    >
      <span className="font-medium">{text} :(</span>
    </div>
  );
};
export default ErrorAlert;

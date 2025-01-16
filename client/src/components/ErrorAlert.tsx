interface ErrorProps {
  text: string;
}

const ErrorAlert = ({ text }: ErrorProps) => {
  return (
    <div
      className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 "
      role="alert"
    >
      <span className="font-medium">{text} :(</span>
    </div>
  );
};
export default ErrorAlert;

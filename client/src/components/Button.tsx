interface ButtonProps {
    label: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}

const Button = ({label, ...props}: ButtonProps) => {
    return (
        <button
          className="text-black bg-green-300 border border-black hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-full text-sm px-6 py-2.5 my-2 text-center me-2 mb-2 "
          {...props}
        >{label}</button>
    )
}

export default Button;
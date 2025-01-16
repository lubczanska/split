interface ButtonProps {
    label: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}

const Button = ({label, ...props}: ButtonProps) => {
    return (
        <button
          className="btn btn-outline btn-primary"
          {...props}
        >{label}</button>
    )
}

export default Button;
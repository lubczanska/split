import { Link } from "react-router-dom";
import Button from "../components/Button";

const Landing = () => {
  return (
    <div className="flex flex-col">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl ">
        Welcome to SPLIT
      </h1>
      <Link to="/login">
        <Button label="Log In or Register" />
      </Link>
      <div>
        <Button label="Quick Split" />
      </div>
    </div>
  );
};

export default Landing;

import { Link } from "react-router-dom";
import configData from "../config.json";

// This is a landing page for future development

const Landing = () => {
  return (
    <div className="card gap-4 my-10">
      <h1 className="stat-value mb-10">Welcome to SPLIT</h1>
      <div className="lg:w-1/4 mx-auto card-actions">
        <Link to={configData.LOGIN_URL} className="w-full btn btn-primary ">
          Log In or Register
        </Link>
        <button className="btn btn-primary w-full" disabled>
          Quick Split
        </button>
      </div>
    </div>
  );
};

export default Landing;

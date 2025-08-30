import { useEffect, useState } from "react";
import LogInForm from "./LogInForm";
import SignUpForm from "./SignUpForm";
import * as Api from "../../network/api";
import { User } from "../../models/user";
import { useNavigate } from "react-router-dom";
import configData from "../../config.json";

interface LogInProps {
  onLoginSuccessful: (user: User) => void;
}

const LogIn = ({ onLoginSuccessful }: LogInProps) => {
  // const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      try {
        setShowRegister(false);
        setErrorText(null);
        // Redirect logged in users to dashboard
        const user = await Api.getLoggedInUser();
        if (user) {
          navigate(configData.DASHBOARD_URL);
        }
      } catch (error) {
        if (error instanceof Error) setErrorText(error.message);
        else alert(error);
        alert(error);
      }
    }
    loadUser();
    setErrorText(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {errorText && <p role="alert">{errorText}</p>}
      {!showRegister && (
        <div className="flex flex-col items-center  justify-center mb-5">
          <h1 className="stat-value mb-10">Welcome to SPLIT</h1>
          <LogInForm
            onLogInSuccessful={(user) => {
              onLoginSuccessful(user);
            }}
            otherButton={
              <button
                type="button"
                className="btn btn-primary btn-outline w-full"
                onClick={() => setShowRegister(true)}
              >
                Not a user yet? Sign Up!
              </button>
            }
          />
        </div>
      )}
      {showRegister && (
        <div className="flex flex-col items-center justify-center mb-5">
          <h1 className="stat-value mb-10">Welcome to SPLIT</h1>
          <SignUpForm
            onSignUpSuccessful={(user) => {
              onLoginSuccessful(user);
            }}
            otherButton={
              <button
                type="button"
                className="btn btn-primary btn-outline w-full"
                onClick={() => setShowRegister(false)}
              >
                I already have an account
              </button>
            }
          />
        </div>
      )}
    </div>
  );
};

export default LogIn;

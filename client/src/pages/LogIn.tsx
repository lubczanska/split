import { useEffect, useState } from "react";
import Button from "../components/Button";
import LogInForm from "../components/login/LogInForm";
import SignUpForm from "../components/login/SignUpForm";
import * as UsersApi from "../network/api";
import { User } from "../models/user";
import { useNavigate } from "react-router-dom";

interface LogInProps {
  onLoginSuccessful: (user: User) => void;
}

const LogIn = ({ onLoginSuccessful }: LogInProps) => {
  // check if user is registered and if yes redirect to dashboard
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
        const user = await UsersApi.getLoggedInUser();
        if (user) {
          navigate("/dashboard");
        }
      } catch (error) {
        setErrorText("Oops, something went wrong!");
        console.error(error);
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
          <LogInForm
            onLogInSuccessful={(user) => {
              onLoginSuccessful(user);
            }}
          />
          <Button
            type="button"
            label="Not a user yet? Sign Up!"
            onClick={() => setShowRegister(true)}
          />
        </div>
      )}
      {showRegister && (
        <div className="flex flex-col items-center justify-center  mb-5">
          <SignUpForm
            onSignUpSuccessful={(user) => {
              onLoginSuccessful(user);
            }}
          />
          <Button
            type="button"
            label="I already have an account"
            onClick={() => setShowRegister(false)}
          />
        </div>
      )}
    </div>
  );
};

export default LogIn;

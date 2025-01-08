import { useEffect, useState } from "react";
import Button from "../components/Button";
import LogInForm from "../components/login/LogInForm";
import SignUpForm from "../components/login/SignUpForm";
import * as UsersApi from "../network/api";

const LogIn = () => {
  // check if user is registered and if yes redirect to dashboard

  const [showRegister, setShowRegister] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setShowRegister(false);
        setErrorText(null);
        const user = await UsersApi.getLoggedInUser();
        //setuser but idk what it does
        //redirect to dashboard
        if (user) console.log(user.username)//window.location.href = "/";
        else console.log("no user" + user);
      } catch (error) {
        setErrorText("Oops, something went wrong!");
        console.error(error);
        alert(error);
      }
    }
    loadUser();
    setErrorText(null);
  }, []);

  async function loadUser() {
    try {
      const user = await UsersApi.getLoggedInUser();
      //setuser but idk what it does
      //redirect to dashboard
      if (user) console.log(user.username)//window.location.href = "/";
      else console.log("no user logged in " + user);
    } catch (error) {
      setErrorText("Oops, something went wrong!");
      console.error(error);
      alert(error);
    }
  }

  return (
    <div>
      {errorText && <p role="alert">{errorText}</p>}
      {!showRegister && (
        <div className="flex flex-col items-center mb-5">
          <LogInForm
            onLogInSuccessful={(user) => {
              console.log(user.username + " just logged in");
              // window.location.href = "/";
              loadUser();
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
        <div className="flex flex-col items-start mb-5">
          <SignUpForm
            onSignUpSuccessful={(user) => {
              //redirect to dashboard /need to finish this its a state and needs to be sent higher
              // window.location.href = "/";
              console.log(user.username + "signed up");
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

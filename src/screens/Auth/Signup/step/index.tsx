import React, { useState } from "react";
import Token from "./Token";
import Password from "./Password";
import AccountCreated from "./AccountCreated";
import { StepNavigationProp } from "../../../../types/navigation/stack";

interface Props {
  gotoSignUp: () => void;
  gotoLogin: () => void;
  email: string;
}
const Step: React.FC<StepNavigationProp> = ({
  route,
  navigation: { navigate },
}) => {
  const [step, setStep] = useState("TOKEN");
  const [token, setToken] = useState<string>("");
  const { email } = route.params;

  const gotoSignUp = () => {
    navigate("SignUp");
  };
  const gotoLogin = () => {
    navigate("Login");
  };

  const onVerify = () => {
    setStep("PASSWORD");
  };
  const onSuccess = () => {
    setStep("SUCCESS");
  };
  const CurrentScreen = () => {
    switch (step) {
      case "PASSWORD":
        return (
          <Password
            back={() => setStep("TOKEN")}
            onSuccess={onSuccess}
            token={token}
          />
        );

      case "SUCCESS":
        return <AccountCreated gotoLogin={gotoLogin} />;

      default:
        return (
          <Token
            email={email}
            onVerify={onVerify}
            back={gotoSignUp}
            setToken={setToken}
          />
        );
    }
  };
  return <CurrentScreen />;
};

export default Step;

import React, { useState } from 'react';
import Token from './Token';
import Password from './Password';
import AccountCreated from './AccountCreated';

interface Props {
  gotoSignUp: () => void;
  gotoLogin: () => void;
  email: string;
}
const Step: React.FC<Props> = ({ gotoSignUp, email, gotoLogin }) => {
  const [step, setStep] = useState('TOKEN');
  const [token, setToken] = useState<string>('');

  const onVerify = () => {
    setStep('PASSWORD');
  };
  const onSuccess = () => {
    setStep('SUCCESS');
  };
  const currentScreen = () => {
    switch (step) {
      case 'PASSWORD':
        return (
          <Password
            back={() => setStep('TOKEN')}
            onSuccess={onSuccess}
            token={token}
          />
        );

      case 'SUCCESS':
        return <AccountCreated gotoLogin={gotoLogin} />;

      default:
        return (
          <Token
            email={email}
            onVerify={onVerify}
            back={gotoSignUp}
            setToken={setToken}
            token={token}
          />
        );
    }
  };
  return currentScreen();
};

export default Step;

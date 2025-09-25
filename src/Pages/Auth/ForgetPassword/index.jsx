import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useModalStore from '../../../Store/ModalStore';

import { useForm } from '../../../Hooks/useForm';
import { SendEmail } from './Services/SendEmail';
import { VerifyCode } from './Services/VerifyCode';
import { ResetPassword } from './Services/ResetPassword';

import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';
import './style.css';

const ForgetPassword = () => {
  const { showModal, closeModal } = useModalStore();

  const navigate = useNavigate();
  const [step, setStep] = useState('step3');
  const [email, setEmail] = useState('');

  const { mutate: sendEmailMutation, isLoading: isEmailLoading } = useForm({
    successMessage: 'Verification code sent to email successfully!',
    onSuccess: () => {
      setStep('step2');
    },
  });

  const { mutate: verifyCodeMutation, isLoading: isVerifyLoading } = useForm({
    successMessage: 'Code verified successfully!',
    onSuccess: () => {
      setStep('step3');
    },
  });

  const { mutate: resetPasswordMutation, isLoading: isResetLoading } = useForm({
    showSuccessToast: false,
    onSuccess: () => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          message: 'Your password has been updated. Please login to continue!',
          continueText: 'Okay',
          onContinue: () => {
            navigate('/login');
            closeModal();
          },
        },
      });
    },
  });

  const handleSubmitStep1 = (values) => {
    setEmail(values.email);
    sendEmailMutation({
      service: SendEmail,
      data: values,
    });
  };

  const handleResendCode = () => {
    sendEmailMutation({
      service: SendEmail,
      data: { email },
    });
  };

  const handleSubmitStep2 = (values) => {
    verifyCodeMutation({
      service: VerifyCode,
      data: {
        email,
        token: values.code,
      },
    });
  };

  const handleSubmitStep3 = (values) => {
    resetPasswordMutation({
      service: ResetPassword,
      data: {
        email,
        password: values.password,
        password_confirmation: values.password,
      },
    });
  };

  return (
    <div className="formCardWrapper mx-auto">
      <div className="formCard">
        <div className="formCardHeader">
          <h1 className="text-uppercase">Forgot Password</h1>
        </div>
        {step == 'step1' && (
          <Step1 action={handleSubmitStep1} isLoading={isEmailLoading} />
        )}
        {step == 'step2' && (
          <Step2
            action={handleSubmitStep2}
            isLoading={isVerifyLoading}
            onResend={handleResendCode}
          />
        )}
        {step == 'step3' && (
          <Step3 action={handleSubmitStep3} isLoading={isResetLoading} />
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;

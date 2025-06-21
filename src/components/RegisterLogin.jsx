import React from 'react';
import Carousel from './Carousel';
import AuthForm from './AuthForm';

const RegisterLogin = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-left">
        <Carousel />
      </div>
      <div className="dashboard-right">
        <AuthForm />
      </div>
    </div>
  );
};

export default RegisterLogin; 
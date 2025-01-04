import React from 'react';
import LoginForm from './LoginForm';
import { getMeUser } from '@/utilities/getMeUser';

const PageLogin = async () => {
  await getMeUser({
    validUserRedirect: '/',
  });

  return (
    <div className="">
      <LoginForm />
    </div>
  );
};

export default PageLogin;

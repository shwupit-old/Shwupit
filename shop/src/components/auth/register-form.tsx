import * as yup from 'yup';
import type { SubmitHandler } from 'react-hook-form';
import type { RegisterUserInput } from '@/types';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { Form } from '@/components/ui/forms/form';
import Password from '@/components/ui/forms/password';
import { useModalAction } from '@/components/modal-views/context';
import Input from '@/components/ui/forms/input';
import client from '@/data/client';
import Button from '@/components/ui/button';
import { RegisterBgPattern } from '@/components/auth/register-bg-pattern';
import { useState } from 'react';
import useAuth from './use-auth';
import { useTranslation } from 'next-i18next';
import RegisterLocation from './register-location';
import axios from 'axios';

const registerUserValidationSchema = yup.object().shape({
  firstName: yup.string().max(20).required(),
  lastName: yup.string().max(20).required(),
  username: yup.string().max(20).required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  country: yup.string().required('Country is required'),
  bio: yup.string().max(500).nullable(), // Make bio nullable
});

type ServerError = {
  username?: string;
  email?: string;
};

export default function RegisterUserForm() {
  const { t } = useTranslation('common');
  const { openModal, closeModal } = useModalAction();
  const { authorize } = useAuth();
  let [serverError, setServerError] = useState<ServerError | null>(null);

  const { mutate } = useMutation(client.users.register, {
    onSuccess: (res) => {
      if (!res.token) {
        toast.error(<b>{t('text-profile-page-error-toast')}</b>, {
          className: '-mt-10 xs:mt-0',
        });
        return;
      }
      authorize(res.token);
      closeModal();
    },
    onError: (err: any) => {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        // Handle conflict errors
        const errorMessage = err.response.data;
        if (errorMessage.includes("Username already exists")) {
          setServerError({ username: errorMessage });
          toast.error("Username already exists");
        } else if (errorMessage.includes("Email already exists")) {
          setServerError({ email: errorMessage });
          toast.error("Email already exists");
        }
      } else {
        setServerError(err.response?.data || null);
        toast.error(err.response?.data?.message || 'Registration failed');
      }
    },
  });

  const onSubmit: SubmitHandler<RegisterUserInput> = (data) => {
    console.log("Form Data:", data); // Log the form data to verify structure
    setServerError(null); // Clear previous errors
    mutate(data);
  };

  return (
    <div className="bg-light px-6 pt-10 pb-8 dark:bg-dark-300 sm:px-8 lg:p-12">
      <div className="relative z-10 flex items-center justify-center">
        <div className="w-full max-w-2xl shrink-0 text-left">
          <div className="flex flex-col pb-5 text-center lg:pb-9 xl:pb-10 xl:pt-2">
            <h2 className="text-lg font-medium tracking-[-0.3px] text-dark dark:text-light lg:text-xl">
              {t('text-start-swapping')}
            </h2>
            <div className="mt-1.5 text-13px leading-6 tracking-[0.2px] dark:text-light-900 lg:mt-2.5 xl:mt-3">
              {t('text-create-an-account')}{' '}
              <button
                onClick={() => openModal('LOGIN_VIEW')}
                className="inline-flex font-semibold text-brand hover:text-dark-400 hover:dark:text-light-500"
              >
                {t('text-login')}
              </button>
            </div>
          </div>

          <Form<RegisterUserInput>
            onSubmit={onSubmit}
            validationSchema={registerUserValidationSchema}
            serverError={serverError}
            className="space-y-4 lg:space-y-5"
          >
            {({ register, setValue, formState: { errors } }) => (
              <>
                <div className="flex space-x-4">
                  <Input
                    label="First Name"
                    inputClassName="bg-light dark:bg-dark-300"
                    {...register('firstName')}
                    error={errors.firstName?.message}
                  />
                  <Input
                    label="Last Name"
                    inputClassName="bg-light dark:bg-dark-300"
                    {...register('lastName')}
                    error={errors.lastName?.message}
                  />
                </div>
                <Input
                  label="Username"
                  inputClassName="bg-light dark:bg-dark-300"
                  {...register('username')}
                  error={errors.username?.message || serverError?.username}
                />
                <Input
                  label="Email"
                  inputClassName="bg-light dark:bg-dark-300"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message || serverError?.email}
                />
                <Password
                  label="Password"
                  inputClassName="bg-light dark:bg-dark-300"
                  {...register('password')}
                  error={errors.password?.message}
                />
                <RegisterLocation
                  onCountrySelect={(country) => setValue('country', country)}
                  setCurrency={(currency) => setValue('currency', currency as string)}  
                  error={errors.country?.message}
                />
                <Button
                  type="submit"
                  className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
                >
                  {t('text-register')}
                </Button>
              </>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
}
import * as yup from 'yup';
import type { SubmitHandler } from 'react-hook-form';
import type { RegisterUserInput } from '@/types';
import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { Form } from '@/components/ui/forms/form';
import Password from '@/components/ui/forms/password';
import { useModalAction } from '@/components/modal-views/context';
import Input from '@/components/ui/forms/input';
import Button from '@/components/ui/button';
import { useState } from 'react';
import useAuth from './use-auth';
import { useTranslation } from 'next-i18next';
import CountryLocation from './country-location';
import { supabase } from '@/data/utils/supabaseClient';
import { setAuthCredentials } from '@/data/client/token.utils';

const registerUserValidationSchema = yup.object().shape({
  firstName: yup.string().max(20).required(),
  lastName: yup.string().max(20).required(),
  username: yup.string().max(20).required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  country: yup.string().required('Country is required'),
  currency: yup.string().required('Currency is required'),
  bio: yup.string().max(500).nullable(),
});

const fetchUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  return data.user;
};

type ServerError = {
  username?: string;
  email?: string;
};

export default function RegisterUserForm() {
  const { t } = useTranslation('common');
  const { openModal, closeModal } = useModalAction();
  const { authorize } = useAuth(); // Correctly destructure authorize
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<ServerError | null>(null);

  const registerUser = async (data: RegisterUserInput) => {
    const { firstName, lastName, username, email, password, country, currency, bio } = data;

    // Check if username already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // Ignore "No rows" error
      throw fetchError;
    }

    if (existingUser) {
      throw { message: 'Username already exists', status: 409 };
    }

    // Handle User Registration
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (authError) {
      throw authError;
    }

    const user = authData.user;

    if (!user) {
      throw new Error('User registration failed');
    }

    // Store additional user data in custom profiles table
    const { error: insertError } = await supabase.from('profiles').insert([
      { id: user.id, first_name: firstName, last_name: lastName, username, email, country, currency, bio },
    ]);

    if (insertError) {
      throw insertError;
    }

    return { user, session: authData.session };
  };

  const { mutate } = useMutation(registerUser, {
    onSuccess: async (res) => {
      if (!res.user || !res.session) {
        toast.error(<b>{t('text-profile-page-error-toast')}</b>, {
          className: '-mt-10 xs:mt-0',
        });
        return;
      }
      try {
        const token = res.session.access_token;
        authorize(token).then(() => {
          setAuthCredentials(token, []);
          queryClient.invalidateQueries('user');
          closeModal();
        });
      } catch (error) {
        toast.error(<b>{t('text-login-error-toast')}</b>, {
          className: '-mt-10 xs:mt-0',
        });
      }
    },
    onError: (err: any) => {
      console.error("Error: ", err); // Log error to the console for debugging

      if (err.status === 409) {
        setServerError({ username: 'Username already exists' });
        toast.error('Username already exists');
      } else if (err.status === 422 && err.message.includes('User already registered')) {
        setServerError({ email: 'Email already exists' });
        toast.error('Email already exists');
      } else {
        // Handle all other errors
        setServerError({ username: 'An error occurred. Please try again.' });
        toast.error('An error occurred. Please try again.');
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
                <CountryLocation
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
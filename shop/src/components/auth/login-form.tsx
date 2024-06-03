import { RegisterBgPattern } from '@/components/auth/register-bg-pattern';
import useAuth from '@/components/auth/use-auth';
import { useModalAction } from '@/components/modal-views/context';
import Button from '@/components/ui/button';
import CheckBox from '@/components/ui/forms/checkbox';
import { Form } from '@/components/ui/forms/form';
import Input from '@/components/ui/forms/input';
import Password from '@/components/ui/forms/password';
import { setAuthCredentials } from '@/data/client/token.utils';
import type { LoginUserInput } from '@/types';
import { useTranslation } from 'next-i18next';
import type { SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
import * as yup from 'yup';
import { supabase } from '@/data/utils/supabaseClient';

const emailOrUsernameSchema = yup
  .string()
  .test('is-email-or-username', 'Must be a valid email or username', value => {
    if (!value) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || value.trim().length > 0;
  })
  .required();

const loginValidationSchema = yup.object().shape({
  identifier: emailOrUsernameSchema,
  password: yup.string().required(),
});

interface LoginUserFormProps {
  onClose?: () => void;
}

export default function LoginUserForm({ onClose }: LoginUserFormProps) {
  const { t } = useTranslation('common');
  const { openModal, closeModal } = useModalAction();
  const { authorize } = useAuth();

  const login = async ({ identifier, password }: LoginUserInput) => {
    let authResponse;
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    if (isEmail) {
      authResponse = await supabase.auth.signInWithPassword({
        email: identifier,
        password,
      });
    } else {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', identifier)
        .single();

      if (userError || !userData) {
        throw new Error('Invalid credentials');
      }

      authResponse = await supabase.auth.signInWithPassword({
        email: userData.email,
        password,
      });
    }

    if (authResponse.error) {
      throw new Error('Invalid credentials');
    }

    return authResponse.data;
  };

  const { mutate, isLoading } = useMutation(login, {
    onSuccess: (data) => {
      if (!data.session) {
        toast.error(<b>{t('Invalid credentials')}</b>, {
          className: '-mt-10 xs:mt-0',
        });
        return;
      }
      authorize(data.session.access_token).then(() => {
        setAuthCredentials(data.session.access_token, []);
        closeModal();
        if (onClose) onClose();
      });
    },
    onError: () => {
      toast.error(<b>{t('Invalid credentials')}</b>, {
        className: '-mt-10 xs:mt-0',
      });
    },
  });

  const onSubmit: SubmitHandler<LoginUserInput> = (data) => {
    mutate(data);
  };

  return (
    <div className="bg-light px-6 pb-8 pt-10 dark:bg-dark-300 sm:px-8 lg:p-12">
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[380px]">
          <div className="flex flex-col pb-5 text-center xl:pb-6 xl:pt-2">
            <h2 className="text-lg font-medium tracking-[-0.3px] text-dark dark:text-light lg:text-xl">
              {t('text-start-swapping')}
            </h2>
            <div className="mt-1.5 text-13px leading-6 tracking-[0.2px] dark:text-light-900 lg:mt-2.5 xl:mt-3">
              {t('text-join-now')}{' '}
              <button
                onClick={() => openModal('REGISTER')}
                className="inline-flex font-semibold text-brand hover:text-dark-400 hover:dark:text-light-500"
              >
                {t('text-create-account')}
              </button>
            </div>
          </div>
          <Form<LoginUserInput>
            onSubmit={onSubmit}
            validationSchema={loginValidationSchema}
            className="space-y-4 pt-4 lg:space-y-5"
          >
            {({ register, formState: { errors } }) => (
              <>
                <Input
                  label="Username or Email"
                  inputClassName="bg-light dark:bg-dark-300"
                  type="text"
                  {...register('identifier')}
                  error={errors.identifier?.message}
                />
                <Password
                  label="Password"
                  inputClassName="bg-light dark:bg-dark-300"
                  {...register('password')}
                  error={errors.password?.message}
                />
                <div className="flex items-center justify-between space-x-5 rtl:space-x-reverse">
                  <CheckBox label="Remember me" />
                  <button
                    type="button"
                    className="text-13px font-semibold text-brand hover:text-dark-400 hover:dark:text-light-500"
                    onClick={() => openModal('FORGOT_PASSWORD_VIEW')}
                  >
                    {t('text-forgot-password')}
                  </button>
                </div>
                <Button
                  type="submit"
                  className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {t('text-get-login')}
                </Button>
              </>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
}
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import type { Attachment, NextPageWithLayout } from '@/types';
import { SubmitHandler } from 'react-hook-form';
import { User, UpdateUserInput } from '@/types';
import { Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DashboardLayout from '@/layouts/_dashboard';
import { Form } from '@/components/ui/forms/form';
import Input from '@/components/ui/forms/input';
import Textarea from '@/components/ui/forms/textarea';
import Button from '@/components/ui/button';
import client from '@/data/client';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
import { useMe } from '@/data/user';
import pick from 'lodash/pick';
import { API_ENDPOINTS } from '@/data/client/endpoints';
import Uploader from '@/components/ui/forms/uploader';
import RegisterLocation from '@/components/auth/register-location';
import * as yup from 'yup';

const profileValidationSchema = yup.object().shape({
  id: yup.string().required(),
  username: yup.string().required(),
  firstName: yup.string().max(20).required(),
  lastName: yup.string().max(20).required(),
  email: yup.string().email().required(),
  country: yup.string().required('Country is required'),
  currency: yup.string().required('Currency is required'),
  bio: yup.string().max(500).nullable(),
  profilePictureURL: yup.string().nullable(),
});

const ProfilePage: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const queryClient = useQueryClient();
  const { me } = useMe();
  const router = useRouter();
  const { mutate, isLoading } = useMutation(client.users.update, {
    onSuccess: () => {
      toast.success(<b>{t('text-profile-page-success-toast')}</b>, {
        className: '-mt-10 xs:mt-0',
      });
    },
    onError: (error: any) => {
      toast.error(<b>{t('text-profile-page-error-toast')}</b>, {
        className: '-mt-10 xs:mt-0',
      });
      console.error('Profile update error:', error);
      if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS_ME);
    },
  });

  const onSubmit: SubmitHandler<UpdateUserInput> = (data) => {
    console.log('Submitting user data:', data);

    if (data.profilePictureURL) {
      console.log('Profile Picture URL:', data.profilePictureURL);
    } else {
      console.log('No Profile Picture URL provided.');
    }

    mutate(data);
  };

  return (
    <motion.div variants={fadeInBottom()} className="flex min-h-full flex-grow flex-col">
      <h1 className="mb-5 text-15px font-medium text-dark dark:text-light sm:mb-6">
        {t('text-profile-page-title')}
      </h1>
      <Form<UpdateUserInput>
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: pick(me, [
            'id',
            'username',
            'firstName',
            'lastName',
            'email',
            'country',
            'currency',
            'bio',
            'profilePictureURL',
          ]),
        }}
        validationSchema={profileValidationSchema}
        className="flex flex-grow flex-col"
      >
        {({ register, reset, control, setValue, formState: { errors } }) => (
          <>
            <fieldset className="mb-6 grid gap-5 pb-5 sm:grid-cols-2 md:pb-9 lg:mb-8">
              <Controller
                name="profilePictureURL"
                control={control}
                render={({ field: { ref, ...rest } }) => (
                  <div className="sm:col-span-2">
                    <span className="block cursor-pointer pb-2.5 font-normal text-dark/70 dark:text-light/70">
                      {t('text-profile-image')}
                    </span>
                    <div className="text-xs">
                      <Uploader
                        onChange={(data: Attachment[] | null) => {
                          console.log('Uploader onChange data:', data);
                          if (data && data.length > 0) {
                            setValue('profilePictureURL', data[0].original);
                          } else {
                            setValue('profilePictureURL', '');
                          }
                        }}
                        value={me?.profilePictureURL ? [{ original: me.profilePictureURL }] : []}
                        multiple={false}
                        removeImage={() => setValue('profilePictureURL', '')}
                      />
                    </div>
                  </div>
                )}
              />
              <Textarea
                label={t('text-profile-bio')}
                {...register('bio')}
                error={errors.bio?.message as string | undefined}
                className="sm:col-span-2"
              />
              <Input
                label="Username"
                {...register('username')}
                error={errors.username?.message as string | undefined}
              />
              <Input
                label="First Name"
                inputClassName="bg-light dark:bg-dark-300"
                {...register('firstName')}
                error={errors.firstName?.message as string | undefined}
              />
              <Input
                label="Last Name"
                inputClassName="bg-light dark:bg-dark-300"
                {...register('lastName')}
                error={errors.lastName?.message as string | undefined}
              />
              <Input
                label="Email"
                inputClassName="bg-light dark:bg-dark-300"
                type="email"
                {...register('email')}
                error={errors.email?.message as string | undefined}
              />
              <RegisterLocation
                value={me?.country}
                onCountrySelect={(country) => setValue('country', country)}
                setCurrency={(currency) =>
                  setValue('currency', currency as string)
                }
                error={errors.country?.message as string | undefined}
              />
            </fieldset>
            <div className="mt-auto flex items-center gap-4 pb-3 lg:justify-end">
              <Button
                type="reset"
                onClick={() => {
                  reset({
                    id: me?.id,
                    username: me?.username,
                    firstName: me?.firstName,
                    lastName: me?.lastName,
                    email: me?.email,
                    country: me?.country,
                    currency: me?.currency,
                    bio: me?.bio,
                    profilePictureURL: me?.profilePictureURL,
                  });
                  router.push('/');
                }}
                disabled={isLoading}
                variant="outline"
                className="flex-1 lg:flex-none"
              >
                {t('text-cancel')}
              </Button>
              <Button className="flex-1 lg:flex-none" isLoading={isLoading} disabled={isLoading}>
                {t('text-save-changes')}
              </Button>
            </div>
          </>
        )}
      </Form>
    </motion.div>
  );
};

ProfilePage.authorization = true;
ProfilePage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
    },
    revalidate: 60, // In seconds
  };
};

export default ProfilePage;
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import type { NextPageWithLayout, UpdateUserInput, Attachment } from '@/types';
import type { SubmitHandler } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DashboardLayout from '@/layouts/_dashboard';
import { Form } from '@/components/ui/forms/form';
import Input from '@/components/ui/forms/input';
import Textarea from '@/components/ui/forms/textarea';
import Button from '@/components/ui/button';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
import { useMe } from '@/data/user';
import { API_ENDPOINTS } from '@/data/client/endpoints';
import Uploader from '@/components/ui/forms/uploader';
import CountryLocation from '@/components/auth/country-location';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { supabase } from '@/data/utils/supabaseClient';
import dayjs from 'dayjs';
import useAuth from '@/components/auth/use-auth';

const profileValidationSchema = yup.object().shape({
  id: yup.string().required(),
  username: yup.string().required(),
  firstName: yup.string().max(20).required(),
  lastName: yup.string().max(20).required(),
  email: yup.string().email().required(),
  country: yup.string().required('Country is required'),
  currency: yup.string().required('Currency is required'),
  profilePictureURL: yup
    .object()
    .shape({
      id: yup.string(),
      thumbnail: yup.string(),
      original: yup.string(),
    })
    .optional()
    .nullable(),
  bio: yup.string().max(500).nullable(),
});

const ProfilePage: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const queryClient = useQueryClient();
  const { me } = useMe();
  const { user } = useAuth();
  const [canChangeUsername, setCanChangeUsername] = useState(true);
  const [usernameChangeDaysLeft, setUsernameChangeDaysLeft] = useState(0);

  useEffect(() => {
    if (me?.lastUsernameChange) {
      const lastChangeDate = dayjs(me.lastUsernameChange);
      const nextAllowedChangeDate = lastChangeDate.add(30, 'day');
      const now = dayjs();
      const difference = nextAllowedChangeDate.diff(now, 'day');
      if (difference > 0) {
        setCanChangeUsername(false);
        setUsernameChangeDaysLeft(difference);
      } else {
        setCanChangeUsername(true);
      }
    }
  }, [me]);

  const { mutate, isLoading } = useMutation(
    async (data: UpdateUserInput) => {
      const profilePictureURL = (data.profilePictureURL as Attachment)?.original || (me?.profilePictureURL as Attachment)?.original || '';

      const { error } = await supabase
        .from('profiles')
        .update({
          username: data.username,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          country: data.country,
          currency: data.currency,
          profile_picture_url: profilePictureURL,
          bio: data.bio,
        })
        .eq('id', data.id);

      if (error) {
        throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        toast.success(<b>{t('text-profile-page-success-toast')}</b>, {
          className: '-mt-10 xs:mt-0',
        });
        queryClient.invalidateQueries(API_ENDPOINTS.USERS_ME);
      },
      onError: (error) => {
        toast.error(<b>{t('text-profile-page-error-toast')}</b>, {
          className: '-mt-10 xs:mt-0',
        });
        console.error('Error updating profile:', error);
      },
    },
  );

  const onSubmit: SubmitHandler<UpdateUserInput> = (data) => {
    if (!canChangeUsername && data.username !== me?.username) {
      toast.error(`Username can only be changed in ${usernameChangeDaysLeft} days.`);
      return;
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
          defaultValues: me && {
            id: me.id,
            username: me.username,
            firstName: me.firstName,
            lastName: me.lastName,
            email: me.email,
            country: me.country,
            currency: me.currency,
            profilePictureURL: me.profilePictureURL 
              ? { id: 'initial', original: me.profilePictureURL, thumbnail: me.profilePictureURL }
              : null,
            bio: me.bio,
          },
        }}
        validationSchema={profileValidationSchema}
        className="flex flex-grow flex-col"
      >
        {({ register, reset, control, setValue, formState: { errors } }) => {
          useEffect(() => {
            if (me) {
              console.log('Profile Data:', me);
              reset({
                id: me.id,
                username: me.username,
                firstName: me.firstName,
                lastName: me.lastName,
                email: me.email,
                country: me.country,
                currency: me.currency,
                profilePictureURL: me.profilePictureURL 
                  ? { id: 'initial', original: me.profilePictureURL, thumbnail: me.profilePictureURL }
                  : null,
                bio: me.bio,
              });
            }
          }, [me, reset]);

          return (
            <>
              <fieldset className="mb-6 grid gap-5 pb-5 sm:grid-cols-2 md:pb-9 lg:mb-8">
                <Controller
                  name="profilePictureURL"
                  control={control}
                  render={({ field: { ref, value, onChange, ...rest } }) => (
                    <div className="sm:col-span-2">
                      <span className="block cursor-pointer pb-2.5 font-normal text-dark/70 dark:text-light/70">
                        {t('text-profile-image')}
                      </span>
                      <div className="text-xs">
                        <Uploader
                          {...rest}
                          initialUrl={value ? value.original : undefined}
                          multiple={false}
                          userId={me?.id!}
                          value={value ? [value].filter((v): v is Attachment => typeof v !== 'string') : null}
                          onChange={(files) => {
                            console.log('Files on change:', files);
                            onChange(files);
                            setValue('profilePictureURL', files?.[0] ?? null);  // Clear profilePictureURL on remove
                          }}
                        />
                      </div>
                    </div>
                  )}
                />
                <Textarea
                  label={t('text-profile-bio')}
                  {...register('bio')}
                  error={errors.bio?.message && 'bio field is required'}
                  className="sm:col-span-2 rounded-none"
                />
                <Input
                  label="Username"
                  {...register('username')}
                  error={errors.username?.message}
                />
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
                <Input
                  label="Email"
                  inputClassName="bg-light dark:bg-dark-300"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <CountryLocation
                      value={field.value}
                      onCountrySelect={field.onChange}
                      setCurrency={(currency) => setValue('currency', currency as string)}
                      error={errors.country?.message}
                    />
                  )}
                />
              </fieldset>
              <div className="mt-auto flex items-center gap-4 pb-3 lg:justify-end">
                <Button
                  type="reset"
                  onClick={() =>
                    reset({
                      id: me?.id,
                      username: '',
                      firstName: '',
                      lastName: '',
                      email: '',
                      country: '',
                      currency: '',
                      profilePictureURL: null,
                      bio: '',
                    })
                  }
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
          );
        }}
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
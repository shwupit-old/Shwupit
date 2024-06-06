import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/layouts/_layout';
import Seo from '@/layouts/_seo';
import { useMe } from '@/data/user';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { ReactElement } from 'react';
import MessagePage from '@/components/messaging/chat';
import LoginUserForm from '@/components/auth/login-form';
import routes from '@/config/routes';

// This function will run at build time in production
// or at request time in a development environment
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  // Load the translations from the common namespace and any other namespace you need
  const translationProps = await serverSideTranslations(locale!, ['common']);

  return {
    props: {
      ...translationProps, // Spread the translations into the props
    },
    revalidate: 60, // Revalidate at most once every 60 seconds
  };
};

const Messages = () => {
  const { isAuthorized, isLoading, error } = useMe();
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      setIsLoginModalOpen(true);
    } else {
      setIsLoginModalOpen(false);
    }
  }, [isAuthorized, isLoading]);

  useEffect(() => {
    document.body.style.overflow = isLoginModalOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoginModalOpen]);

  if (isLoading) {
    return <div>Loading...</div>;
  }


  if (isLoginModalOpen) {
    return (
      <div className="flex items-center justify-center bg-gray-100 min-h-screen">
        <LoginUserForm onClose={() => setIsLoginModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="bg-white">
      <MessagePage />
    </div>
  );
};

Messages.getLayout = function getLayout(page: ReactElement): ReactElement {
  return (
    <Layout>
      <Seo
        title="Messages - Shwupit"
        description="Connect with other users through messages."
        url={routes.messages}
      />
      {page}
    </Layout>
  );
};

Messages.authorization = true;
export default Messages;
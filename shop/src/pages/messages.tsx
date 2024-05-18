import React, { useState, useEffect } from 'react';
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
  const { isAuthorized } = useMe();
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    // Disable scroll on mount
    document.body.style.overflow = 'hidden';
    // Re-enable scroll on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center bg-gray-100">
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
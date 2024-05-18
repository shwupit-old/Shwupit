import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/layouts/_layout';
import Seo from '@/layouts/_seo';
import { useMe } from '@/data/user';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { ReactElement } from 'react';
import LoginUserForm from '@/components/auth/login-form';
import routes from '@/config/routes';
import MySwapsContent from '@/components/ui/swaps/my-swaps-content'; 

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

const Swaps = () => {
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
      <div className="flex items-center justify-center bg-white">
        <LoginUserForm onClose={() => setIsLoginModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="bg-white">
      <MySwapsContent />
    </div>
  );
};

Swaps.getLayout = function getLayout(page: ReactElement): ReactElement {
  return (
    <Layout>
      <Seo
        title="My Swaps - Shwupit"
        description="Manage your swap activities, view swap requests, ongoing and past swaps, saved items, disputes, and analytics."
        url={routes.mySwaps}
      />
      {page}
    </Layout>
  );
};

Swaps.authorization = true;
export default Swaps;
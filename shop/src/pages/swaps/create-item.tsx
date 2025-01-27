import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/layouts/_layout';
import Seo from '@/layouts/_seo';
import { useModalAction } from '@/components/modal-views/context';
import { useMe } from '@/data/user';
import useCreateItem from '@/lib/hooks/use-create-swap';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { ReactElement } from 'react';
import LoginUserForm from '@/components/auth/login-form';
import routes from '@/config/routes';
import CreateItemHeader from '@/components/ui/create-swap/create-item-header';
import ItemDetailsSection from '@/components/ui/create-swap/create-item-info';
import { useTheme } from 'next-themes';

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
const CreateAnItem= () => {
  const { mutate: createItem, isLoading, error } = useCreateItem();
  const { isAuthorized } = useMe();
  const { openModal } = useModalAction();
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleSubmit = (newSwapData) => {
    createItem(newSwapData, {
      onSuccess: () => {
        // Success logic
      },
      onError: (error) => {
        // Error logic
      },
    });
  };

  if (isLoading) return <p>Submitting...</p>;
  if (error) return <p>An error occurred: {(error as Error).message}</p>;

  return (  
   
    <div className="bg-white min-h-screen">
      <CreateItemHeader/>
      <ItemDetailsSection/>
  

    </div>
  );
};

CreateAnItem.getLayout = function getLayout(page: ReactElement): ReactElement {
  return (
    <Layout>
      <Seo
        title="List An Item - Shwupit"
        description="Easily list your items and connect with swappers eager for their next find."
        url="/swaps"
      />
      {page}
    </Layout>
  );
};

CreateAnItem.authorization = true; 
export default CreateAnItem;
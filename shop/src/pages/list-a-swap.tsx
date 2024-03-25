import React, { ReactElement } from 'react';
import Layout from '@/layouts/_layout';
import Seo from '@/layouts/_seo';

import useListSwaps from '../lib/hooks/use-list-a-swap';

const ListASwap= () => {
  const { data: items, isLoading, error } = useListSwaps();

  if (isLoading) return <p>Loading...</p>;
  // Explicitly cast error to an Error object
  if (error) return <p>An error occurred: {(error as Error).message}</p>;

  return (
    <div>
      <h1>List an Item</h1>
      <p>This is the basic implementation of the list-an-item page.</p>
      {/* Render your items here */}
    </div>
  );
};
ListASwap.getLayout = function getLayout(page: ReactElement): ReactElement {
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

export default ListASwap;
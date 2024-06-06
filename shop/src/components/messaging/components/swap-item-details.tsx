import React from 'react';

const ItemSwapDetails: React.FC = () => {
  const currentUserItem = {
    imageUrl: 'placeholder-image-url.png', // Replace with actual placeholder image URL
    name: 'Item 1',
    description: 'Description of item 1',
  };

  const recipientUserItem = {
    imageUrl: 'placeholder-image-url.png', // Replace with actual placeholder image URL
    name: 'Item 2',
    description: 'Description of item 2',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src={currentUserItem.imageUrl} alt={currentUserItem.name} style={{ width: '50px', height: '50px' }} />
        <div>{currentUserItem.name}</div>
        <div>{currentUserItem.description}</div>
      </div>
      <div style={{ fontSize: '24px' }}>⇄</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src={recipientUserItem.imageUrl} alt={recipientUserItem.name} style={{ width: '50px', height: '50px' }} />
        <div>{recipientUserItem.name}</div>
        <div>{recipientUserItem.description}</div>
      </div>
    </div>
  );
};

export default ItemSwapDetails;
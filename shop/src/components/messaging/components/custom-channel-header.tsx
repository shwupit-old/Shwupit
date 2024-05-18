// src/messaging/components/custom-channel-header.tsx
import React from 'react';
import ItemSwapDetails from './swap-item-details'; // Adjust the import path as necessary
import { Channel, ChannelHeaderProps } from '@sendbird/uikit-react/Channel/components/ChannelHeader/types';

interface CustomChannelHeaderProps extends ChannelHeaderProps {
  currentChannel: Channel;
}

const CustomChannelHeader: React.FC<CustomChannelHeaderProps> = (props) => {
  const { currentChannel } = props;
  const { name } = currentChannel;

  return (
    <div className="custom-channel-header">
      <div className="channel-title">{name}</div>
      <ItemSwapDetails />
    </div>
  );
};

export default CustomChannelHeader;
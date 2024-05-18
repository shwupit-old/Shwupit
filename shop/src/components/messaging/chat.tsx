import React, { useState, useEffect } from 'react';
import { SendBirdProvider } from '@sendbird/uikit-react';
import SendbirdApp from '@sendbird/uikit-react/App';
import SendbirdChat from '@sendbird/chat';
import { GroupChannelModule } from '@sendbird/chat/groupChannel';
import '@sendbird/uikit-react/dist/index.css';
import customStringSet from '../messaging/localization/custom-localization';

const appId = "F01ABDC1-F6A0-46CF-BE79-5A21B3E56C91";
const userId = "alimatak";

const Chat: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 914);
  const [channelUrl, setChannelUrl] = useState<string>('');

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 914);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const initSendBird = async () => {
      const sb = SendbirdChat.init({
        appId,
        modules: [new GroupChannelModule()],
      });

      try {
        await sb.connect(userId);
        const channelParams = {
          name: 'Channel Name',
          userIds: ['user1', 'user2'],
        };
        const channel = await sb.groupChannel.createChannel(channelParams);
        setChannelUrl(channel.url);
      } catch (error) {
        console.error(error);
      }
    };

    initSendBird();
  }, []);

  return (
    <div className="sendbird-container">
      <SendBirdProvider
        appId={appId}
        userId={userId}
        breakpoint={isMobile ? "914px" : false}
        stringSet={customStringSet}
      >
        <div className={`w-full ${isMobile ? 'h-[calc(100vh-6rem)]' : 'h-[calc(100vh-4rem)]'}`}>
          <SendbirdApp
            appId={appId}
            userId={userId}
            nickname="Alimat Akano"
            profileUrl=""
            accessToken={null}
            theme="light"
            allowProfileEdit={false}
            breakpoint={isMobile ? "914px" : false}
            uikitOptions={{
              groupChannelSettings: {
                enableMessageSearch: true,
              },
            }}
            stringSet={customStringSet}
            renderChannelHeader={(props) => <CustomChannelHeader {...props} />} // Custom header
          />
        </div>
      </SendBirdProvider>
    </div>
  );
};

const CustomHeader = () => (
  <div className="custom-header">
    <h2>Custom Component</h2>
  </div>
);

const CustomChannelHeader = ({ channel }) => {
  if (!channel) {
    return null;
  }

  return (
    <div className="sendbird-chat-header">
      <div className="sendbird-conversation__channel-header">
        <div className="sendbird-ui-header">
          <h1>{channel.name}</h1>
        </div>
        <CustomHeader />
      </div>
    </div>
  );
};

export default Chat;
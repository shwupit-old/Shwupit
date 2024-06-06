import React, { useState } from 'react';

const MySwapsContent = () => {
  const [activeTab, setActiveTab] = useState('swapItems');

  const renderContent = () => {
    switch (activeTab) {
      case 'swapItems':
        return <div>Swap Items Content</div>;
      case 'swapRequests':
        return <div>Swap Requests Content</div>;
      case 'ongoingSwaps':
        return <div>Ongoing Swaps Content</div>;
      case 'pastSwaps':
        return <div>Past Swaps Content</div>;
      case 'savedItems':
        return <div>Saved Items Content</div>;
      case 'swapDisputes':
        return <div>Swap Disputes Content</div>;
      case 'swapAnalytics':
        return <div>Swap Analytics Content</div>;
      default:
        return <div>Swap Items Content</div>;
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex gap-4 mb-6">
        <button
          className={`py-2 px-4 border ${activeTab === 'swapItems' ? 'bg-gray-300' : 'bg-white'} hover:bg-gray-200`}
          onClick={() => setActiveTab('swapItems')}
        >
          Swap Items
        </button>
        <button
          className={`py-2 px-4 border ${activeTab === 'swapRequests' ? 'bg-gray-300' : 'bg-white'} hover:bg-gray-200`}
          onClick={() => setActiveTab('swapRequests')}
        >
          Swap Requests
        </button>
        <button
          className={`py-2 px-4 border ${activeTab === 'ongoingSwaps' ? 'bg-gray-300' : 'bg-white'} hover:bg-gray-200`}
          onClick={() => setActiveTab('ongoingSwaps')}
        >
          Ongoing Swaps
        </button>
        <button
          className={`py-2 px-4 border ${activeTab === 'pastSwaps' ? 'bg-gray-300' : 'bg-white'} hover:bg-gray-200`}
          onClick={() => setActiveTab('pastSwaps')}
        >
          Past Swaps
        </button>
        <button
          className={`py-2 px-4 border ${activeTab === 'savedItems' ? 'bg-gray-300' : 'bg-white'} hover:bg-gray-200`}
          onClick={() => setActiveTab('savedItems')}
        >
          Saved Items
        </button>
        <button
          className={`py-2 px-4 border ${activeTab === 'swapDisputes' ? 'bg-gray-300' : 'bg-white'} hover:bg-gray-200`}
          onClick={() => setActiveTab('swapDisputes')}
        >
          Swap Disputes
        </button>
        <button
          className={`py-2 px-4 border ${activeTab === 'swapAnalytics' ? 'bg-gray-300' : 'bg-white'} hover:bg-gray-200`}
          onClick={() => setActiveTab('swapAnalytics')}
        >
          Swap Analytics
        </button>
      </div>
      <div className="p-4 bg-white border rounded shadow">
        {renderContent()}
      </div>
    </div>
  );
};

export default MySwapsContent;
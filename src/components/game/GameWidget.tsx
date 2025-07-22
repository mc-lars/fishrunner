'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import PhaserGameComponent only on client
const PhaserGameComponent = dynamic(() => import('./PhaserGameComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-blue-50 rounded-lg">
      <div className="text-center">
        <div className="text-4xl mb-2">🐟</div>
        <div className="text-lg text-blue-600">Loading Fish Escape...</div>
        <div className="text-sm text-blue-400 mt-2">Preparing your aquatic adventure!</div>
      </div>
    </div>
  ),
});

const GameWidget: React.FC = () => {
  const [isClient, setIsClient] = useState<boolean>(false);
  
  useEffect(() => { 
    setIsClient(true); 
  }, []);
  
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-96 bg-blue-50 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-2">🌊</div>
          <div className="text-lg text-blue-600">Initializing Game...</div>
        </div>
      </div>
    );
  }
  
  return <PhaserGameComponent />;
};

export default GameWidget;
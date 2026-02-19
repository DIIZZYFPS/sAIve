import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import App from './App';
import { Loader } from './components/Loader';
import { useAi } from '@/context/AiContext';
import { useSettings } from '@/context/SettingsContext';
import { SetupScreen } from '@/components/SetupScreen';

// The function to fetch transactions, which will be used by the query
const fetchTransactions = async () => {
  const response = await api.get("/transactions/");
  return response.data;
};

const MainApp: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const queryClient = useQueryClient();
  const { loadModel } = useAi();
  const { aiEnabled } = useSettings();

  const hasInitiatedLoad = React.useRef(false);

  useEffect(() => {
    const minDisplayTime = 2000; // Minimum 2 seconds loader time

    const timerPromise = new Promise(resolve => setTimeout(resolve, minDisplayTime));

    // Use queryClient.fetchQuery to pre-fetch data and warm the cache
    const dataPromise = queryClient.fetchQuery({
      queryKey: ['transactions'],
      queryFn: fetchTransactions,
    });

    Promise.all([timerPromise, dataPromise])
      .catch(error => {
        console.error("Failed to pre-fetch initial data:", error);
      })
      .finally(() => {
        setIsAppLoading(false);
      });
  }, [queryClient]);

  // Separate effect for AI loading to prevent re-triggering loop
  useEffect(() => {
    if (aiEnabled && !hasInitiatedLoad.current) {
      hasInitiatedLoad.current = true;
      // Add delay to ensure worker script is fully evaluated and listening
      setTimeout(() => {
        loadModel().catch(err => console.warn("Background AI model load failed:", err));
      }, 1000);
    }
  }, [aiEnabled, loadModel]);

  if (isAppLoading) {
    return <Loader className="h-screen w-screen" size={120} />;
  }

  return <App />;
};

const AppShell: React.FC = () => {
  const { hasCompletedSetup } = useSettings();

  if (!hasCompletedSetup) {
    return <SetupScreen />;
  }

  return <MainApp />;
};

export default AppShell;
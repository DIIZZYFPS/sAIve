import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import App from './App';
import AppLoader from './components/appLoader';
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

  useEffect(() => {
    const minDisplayTime = 2000; // Minimum 2 seconds loader time

    const timerPromise = new Promise(resolve => setTimeout(resolve, minDisplayTime));

    // Use queryClient.fetchQuery to pre-fetch data and warm the cache
    const dataPromise = queryClient.fetchQuery({
      queryKey: ['transactions'],
      queryFn: fetchTransactions,
    });

    // Load AI model in parallel if enabled (don't block on failure)
    // If coming from SetupScreen, it might already be loaded/loading, 
    // but calling loadModel again is safe (handled in context/worker)
    const aiPromise = aiEnabled
      ? loadModel().catch(err => console.warn("AI model load deferred:", err))
      : Promise.resolve();

    Promise.all([timerPromise, dataPromise, aiPromise])
      .catch(error => {
        console.error("Failed to pre-fetch initial data:", error);
      })
      .finally(() => {
        setIsAppLoading(false);
      });
  }, [queryClient, aiEnabled]); // added aiEnabled dependency for correctness

  if (isAppLoading) {
    return <AppLoader />;
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
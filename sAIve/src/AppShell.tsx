import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import App from './App';
import AppLoader from './components/appLoader';

// The function to fetch transactions, which will be used by the query
const fetchTransactions = async () => {
  const response = await api.get("/transactions/");
  return response.data;
};

const AppShell: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const queryClient = useQueryClient();

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

  if (isAppLoading) {
    return <AppLoader />;
  }

  // App no longer needs initial data props; it will be read from the cache
  return <App />;
};

export default AppShell;
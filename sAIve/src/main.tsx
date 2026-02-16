import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppShell from './AppShell.tsx'; // Import the new AppShell
import { ThemeProvider } from "@/components/ThemeProvider";
import { SettingsProvider } from "@/context/SettingsContext";
import { AiProvider } from "@/context/AiContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureApi } from '@/lib/api';

const queryClient = new QueryClient();

// Configure the backend port before rendering
configureApi().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <SettingsProvider>
          <QueryClientProvider client={queryClient}>
            <AiProvider>
              <AppShell />
            </AiProvider>
          </QueryClientProvider>
        </SettingsProvider>
      </ThemeProvider>
    </StrictMode>,
  );
});

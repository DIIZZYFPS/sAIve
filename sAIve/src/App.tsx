import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useTheme } from "@/components/ThemeProvider";
import Layout from '@/Layout';

import Index from '@/pages/Index';
import Flow from '@/pages/Flow';
import Transactions from '@/pages/Transactions';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import NotFound from './pages/NotFount';

function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster richColors position="bottom-right" theme={theme as "light" | "dark" | "system"} />;
}

// App is now completely clean of data-passing logic
function App() {
  return (
    <>
      <ThemedToaster />
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/flow" element={<Flow />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
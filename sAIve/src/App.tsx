import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useTheme } from "@/components/ThemeProvider";

import Index from '@/pages/Index';
import Flow from '@/pages/Flow';
import Transactions from '@/pages/Transactions';
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
          <Route path="/" element={<Index />} />
          <Route path="/flow" element={<Flow />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
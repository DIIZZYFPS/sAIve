import { Toaster } from 'sonner'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, useTheme } from "@/components/ThemeProvider"

// Pages
import Index from '@/pages/Index'
import Flow from '@/pages/Flow'
import Transactions from '@/pages/Transactions'
import NotFound from './pages/NotFount'

function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster richColors position="bottom-right" theme={theme} />;
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ThemedToaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/flow" element={<Flow />} />
          <Route path="/transactions" element={<Transactions />} />
          {/* New Routes above Here */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App

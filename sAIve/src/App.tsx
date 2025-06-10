import { Toaster } from 'sonner'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useTheme } from "@/components/ThemeProvider"


// Pages
import Index from '@/pages/Index'
import Flow from '@/pages/Flow'
import Transactions from '@/pages/Transactions'
import NotFound from './pages/NotFount'
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";


function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster richColors position="bottom-right" theme={theme} />;
}

function App() {

    const {
    data: transactions = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await api.get("/transactions/");
      return response.data;
    },
    
  });

  return (
    <>
      <ThemedToaster />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index transactions={transactions} isLoading={isLoading} isError={isError} refetch={refetch} />} />
          <Route path="/flow" element={<Flow />} />
          <Route path="/transactions" element={<Transactions transactions={transactions} isLoading={isLoading} isError={isError} refetch={refetch} />} />
          {/* New Routes above Here */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;

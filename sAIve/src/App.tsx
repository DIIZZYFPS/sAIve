import {Toaster} from 'sonner'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { ThemeProvider } from "@/components/ThemeProvider"

//Pages
import Index from '@/pages/Index'
import Flow from '@/pages/Flow'
import NotFound from './pages/NotFount'



function App() {


  return (
    <>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Toaster richColors position="top-right" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/flow" element={<Flow />} />
              
              {/* New Routes above Here */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App

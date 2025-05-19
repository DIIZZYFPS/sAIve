import {Toaster} from 'sonner'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Index from "@/pages/Index"
import { ThemeProvider } from "@/components/ThemeProvider"



function App() {


  return (
    <>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Toaster richColors position="top-right" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
            </Routes>
          </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App

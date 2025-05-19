import {Toaster} from 'sonner'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Index from "@/pages/Index"



function App() {


  return (
    <>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

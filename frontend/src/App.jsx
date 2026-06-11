import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import TapalLayout from './pages/TapalLayout'
import Receipt from './Receipt/Receipt'
import Acknowledgement from './Acknowledgement/Acknowledgement'
import Reports from './Reports/Reports'

function App() {

  return (
    <>
     <Routes>
        {/* Redirect Route */}
        <Route path="/" element={<Navigate to="/tapal" />} />
          <Route path="/tapal" element={<TapalLayout />}>
          <Route path="receipt-entry" element={<Receipt/>} />
          <Route path="acknowledgement" element={<Acknowledgement />} />
          <Route path="reports" element={<Reports />} />
        </Route>
     </Routes>
    </>
  )
}

export default App

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Login from './pages/Login.jsx'
import CreateStudent from './pages/CreateStudent.jsx'
import { Routes, Route } from 'react-router-dom'
import CreateUser from './pages/CreateUser.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/create-student" element={<CreateStudent />} />
        
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

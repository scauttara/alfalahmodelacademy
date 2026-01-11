import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Login from './pages/Login.jsx'
import CreateStudent from './pages/CreateStudent.jsx'
import { Routes, Route } from 'react-router-dom'
import CreateUser from './pages/CreateUser.jsx'
import ListAllStudents from './pages/ListAllStudents.jsx'
import App from './App.jsx'
import { SchoolProvider } from './context/SchoolContext.jsx'
import LandingPage from './pages/LandingPage.jsx'
import RoleGate from './config/RoleGate.jsx'
import SchoolInfoForm from './pages/SchoolInfoForm.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SchoolProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/create-student" element={<CreateStudent />} />
          <Route path='/all-students' element={<ListAllStudents />} />
          <Route path='/school-settings' element={<RoleGate allowedRoles={['super', 'admin']}>
            <SchoolInfoForm />
          </RoleGate>} />
        </Routes>
      </BrowserRouter>
    </SchoolProvider>


  </StrictMode>,
)

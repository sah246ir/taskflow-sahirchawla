import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'
import { ROUTES } from './config/routes'
import { ProtectedLayout } from './layouts/ProtectedLayout'
import { MainLayout } from './layouts/MainLayout'
function App() {

  return (
    <Routes>
       <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Login />} />
       <Route path="/" element={<MainLayout />}>
           <Route index element={<Navigate to={ROUTES.HOME} />} />
           <Route path={ROUTES.HOME} element={<Home />} />
       </Route>
    </Routes>
  )
}

export default App

import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'
import { ROUTES } from './config/routes'
import { MainLayout } from './layouts/MainLayout'
import Projects from './pages/projects'
import ProjectTasks from './pages/project-tasks'
function App() {

  return (
    <Routes>
       <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} />
       <Route path="/" element={<MainLayout />}>
           <Route index element={<Navigate to={ROUTES.HOME} />} />
           <Route path={ROUTES.HOME} element={<Home />} />
           <Route path={ROUTES.PROJECTS} element={<Projects />} />
           <Route path={ROUTES.PROJECT_DETAIL} element={<ProjectTasks />} />
       </Route>
    </Routes>
  )
}

export default App

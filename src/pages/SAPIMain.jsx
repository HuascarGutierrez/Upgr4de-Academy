import React from 'react'
import NavLateral from '../components/organisms/NavLateral'
import './styles/SAPIMain.css'
import { Routes, Route } from 'react-router-dom' // Esto ya está correcto (sin BrowserRouter)
import SignUp from './SignUp' // Revisa si estos son necesarios aquí
import Login from './Login'   // Revisa si estos son necesarios aquí
import Courses from '../components/organisms/Courses'
import Perfil from '../components/organisms/Perfil'
import Supervision from '../components/organisms/Supervision'
import CoursesCatalog from '../components/organisms/CoursesCatalog'
import CourseDetail from '../components/organisms/CourseDetail'
import InteractiveCourse from '../components/organisms/InteractiveCourse'
import UserTable from '../components/organisms/UserTable'
import ModuloEjercicios from '../components/organisms/ModuloEjercicios'
import Busqueda from '../components/organisms/Busqueda'
import GamificationDashboard from '../components/organisms/GamificationDashboard'

function SAPIMain({ user }) {

  return (
    <div className='SAPIMain'>
      <NavLateral />
      <div className='SAPIContent'>
        <Routes>
          <Route path='/courses' element={<Courses />} />
          <Route path='/catalogo' element={<CoursesCatalog user={user} />} />
          <Route path='/supervision' element={<Supervision user={user} />} />
          <Route path='/perfil' element={<Perfil user={user} />} />
          <Route path='/courses/course' element={<CourseDetail user={user} />} />
          <Route path='/courses/course/interactive-course' element={<InteractiveCourse user={user} />} />
          <Route path='/courses/course/interactive-exercises' element={<ModuloEjercicios user={user} />} />
          <Route path='/catalogo/busqueda' element={<Busqueda user={user} />} />
          {/* ¡EL CAMBIO ESTÁ AQUÍ! */}
          {/* La ruta ahora debe ser relativa a /main/, por lo tanto, es '/gamification' */}
          {/* Cuando se accede a /main/gamification, este Routes interno busca '/gamification' */}
          <Route path='/gamification' element={<GamificationDashboard user={user} />} />
        </Routes>
      </div>
    </div>
  )
}

export default SAPIMain
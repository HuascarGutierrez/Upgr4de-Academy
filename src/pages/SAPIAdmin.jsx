import React from 'react'
import NavLateral from '../components/organisms/NavLateral'
import './styles/SAPIMain.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUp from './SignUp'
import Login from './Login'
import Courses from '../components/organisms/Courses'
import Perfil from '../components/organisms/Perfil'
import Supervision from '../components/organisms/Supervision'
import CoursesCatalog from '../components/organisms/CoursesCatalog'
import CourseDetail from '../components/organisms/CourseDetail'
import UserTable from '../components/organisms/UserTable'
import NavAdmin from '../components/organisms/NavAdmin'
import CrearCurso from '../components/organisms/CrearCurso'
import MostrarCursos from '../components/organisms/MostrarCursos'
import CrearUserA from '../components/organisms/CrearUserA'
import Reportes from '../components/organisms/Reportes'
import TeacherTable from '../components/organisms/TeacherTable'
import CrearDocente from '../components/organisms/CrearDocente'
import UsersSection from '../components/organisms/UsersSection'
import CrearAdministrador from '../components/organisms/CrearAdministrador'

import CrearEvaluacion from '../components/organisms/CrearEvaluacion'
import EditarEvaluacion from '../components/organisms/EditarEvaluacion'
import AdminDashboard from '../components/organisms/AdminDashboard';
function SAPIAdmin({user}) {
  return (
    <div className='SAPIAdmmin'>
    <NavAdmin user={user}/>
    <div className='SAPIAdminContent'>
        <Routes>
            <Route path='/usersSection' element={<UsersSection user={user}/>}/>
            <Route path='/usertable' element={<UserTable user={user} />}/>
            <Route path='/docentes' element={<TeacherTable user={user}/>} />
            <Route path='/listacursos' element={<MostrarCursos user={user}/>}/>
            <Route path='/crearcurso' element={<CrearCurso user={user}/>}/>
            <Route path='/crearEvaluacion' element={<CrearEvaluacion user={user}/>}/>
            <Route path='/editEvaluacion' element={<EditarEvaluacion user={user}/>}/>
            <Route path='/createuser' element={<CrearUserA user={user}/>} />
            <Route path='/creardocente' element={<CrearDocente user={user} />}/>
            <Route path='/reportes' element={<Reportes user={user}/>} />
            <Route path='/crearadmin' element={<CrearAdministrador user={user}/>}/>
            <Route path='/solicitudes-pago' element={<AdminDashboard user={user}/>} />
        </Routes>
    </div>
</div>
  )
}

export default SAPIAdmin
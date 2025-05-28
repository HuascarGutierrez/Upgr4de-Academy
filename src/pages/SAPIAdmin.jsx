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

function SAPIAdmin() {
  return (
    <div className='SAPIAdmmin'>
    <NavAdmin />
    <div className='SAPIAdminContent'>
        <Routes>
            <Route path='/usersSection' element={<UsersSection/>}/>
            <Route path='/usertable' element={<UserTable />}/>
            <Route path='/docentes' element={<TeacherTable />} />
            <Route path='/listacursos' element={<MostrarCursos />}/>
            <Route path='/crearcurso' element={<CrearCurso />}/>
            <Route path='/createuser' element={<CrearUserA/>} />
            <Route path='/creardocente' element={<CrearDocente />}/>
            <Route path='/reportes' element={<Reportes/>} />
            <Route path='/crearadmin' element={<CrearAdministrador />}/>
        </Routes>
    </div>
</div>
  )
}

export default SAPIAdmin
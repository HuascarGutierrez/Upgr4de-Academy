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
import AdminEdit from '../components/organisms/AdminEdit'

function SAPIMain({user}) {

  return (
    <div className='SAPIMain'>
        <NavLateral/>
        <div className='SAPIContent'>
            <Routes>
                
                <Route path='/cursos' element={<Courses/>} />
                <Route path='/catalogo' element={<CoursesCatalog/>}/>
                <Route path='/supervision' element={<Supervision/>}/> 
                <Route path='/perfil' element={<Perfil user={user}/>}/> 
                <Route path='/catalogo/:courseId' element={<CourseDetail />} />
                <Route path='/usertable' element={<UserTable />}/>
                <Route path='/adminedit/:id' element={<AdminEdit />}/>

            </Routes>
        </div>
    </div>
  )
}

export default SAPIMain
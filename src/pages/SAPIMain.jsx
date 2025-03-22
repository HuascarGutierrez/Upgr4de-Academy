import React from 'react'
import NavLateral from '../components/organisms/NavLateral'
import './styles/SAPIMain.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUp from './SignUp'
import Login from './Login'
import Courses from '../components/organisms/Courses'
import CoursesCatalog from '../components/organisms/coursesCatalog'
import Perfil from '../components/organisms/Perfil'
import Supervision from '../components/organisms/Supervision'
import CourseDetail from '../components/organisms/CourseDetail'

function SAPIMain({user}) {

  return (
    <div className='SAPIMain'>
        <NavLateral/>
        <div className='SAPIContent'>
            <Routes>
                 <Route path='/courses' element={<Courses/>}/>
                <Route path='/catalogo' element={<CoursesCatalog/>}/>
                <Route path='/supervision' element={<Supervision/>}/> 
                <Route path='/perfil' element={<Perfil user={user}/>}/> 
                <Route path='/catalogo/:courseId' element={<CourseDetail />} />
            </Routes>
        </div>
    </div>
  )
}

export default SAPIMain
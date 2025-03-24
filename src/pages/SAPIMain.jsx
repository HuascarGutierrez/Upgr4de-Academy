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
import InteractiveCourse from '../components/organisms/InteractiveCourse'

function SAPIMain({user}) {

  return (
    <div className='SAPIMain'>
        <NavLateral/>
        <div className='SAPIContent'>
            <Routes>
                 <Route path='/courses' element={<Courses/>}/>
                <Route path='/catalogo' element={<CoursesCatalog/>}/>
                <Route path='/supervision' element={<Supervision user={user}/>}/> 
                <Route path='/perfil' element={<Perfil user={user}/>}/> 
                <Route path='/courses/course' element={<CourseDetail />} />
                <Route path='/courses/course/interactive-course' element={<InteractiveCourse />} />
            </Routes>
        </div>
    </div>
  )
}

export default SAPIMain
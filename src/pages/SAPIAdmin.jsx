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

function SAPIAdmin() {
  return (
    <div className='SAPIMain'>
    <NavAdmin />
    <div className='SAPIContent'>
        <Routes>
            <Route path='/usertable' element={<UserTable />}/>
        </Routes>
    </div>
</div>
  )
}

export default SAPIAdmin
import React from 'react'
import NavLateral from '../components/organisms/NavLateral'
import './styles/SAPIMain.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUp from './SignUp'
import Login from './Login'
import Courses from '../components/organisms/Courses'
import CoursesCatalog from '../components/organisms/CoursesCatalog'
import Perfil from '../components/organisms/Perfil'
import Supervision from '../components/organisms/Supervision'
import InicioAdmin from "../components/organisms/InicioAdmin"
import CatalogoAdmin from "../components/organisms/CatalogoAdmin"

function SAPIMain({user}) {
  return (
    <div className='SAPIMain'>
        <NavLateral/>
        <div className='SAPIContent'>
            <Routes>
                {/** EJEMPLOS
                 * <Route path='hola' element={<SignUp/>}/>
                  <Route path='adios' element={<Login/>}/>
                 */}
                 <Route path='/courses' element={<Courses/>}/>
                <Route path='/catalogo' element={<CoursesCatalog/>}/>
                <Route path='/supervision' element={<Supervision/>}/> 
                <Route path='/Perfil' element={<Perfil user={user}/>}/> 
            </Routes>
        </div>
    </div>
  )
}

export default SAPIMain
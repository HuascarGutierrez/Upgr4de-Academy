import React from 'react'
import NavLateral from '../components/organisms/NavLateral'
import './styles/SAPIMain.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CoursesCatalog from '../components/organisms/CoursesCatalog'
import Perfil from '../components/organisms/Perfil'
import Supervision from '../components/organisms/Supervision'

function SAPIMain() {
  return (
    <div className='SAPIMain'>
        <NavLateral/>
        <div className='SAPIContent'>
            <Routes>
                <Route path='catalogo' element={<CoursesCatalog/>}/>
                <Route path='supervision' element={<Supervision/>}/> 
                <Route path='/Perfil' element={<Perfil/>}/> 
            </Routes>
        </div>
    </div>
  )
}

export default SAPIMain
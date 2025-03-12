import React from 'react'
import NavLateral from '../components/organisms/NavLateral'
import './styles/SAPIMain.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUp from './SignUp'
import Login from './Login'

function SAPIMain() {
  return (
    <div className='SAPIMain'>
        <NavLateral/>
        <div className='SAPIContent'>
            <Routes>
                {/** EJEMPLOS
                 * <Route path='hola' element={<SignUp/>}/>
                  <Route path='adios' element={<Login/>}/>
                 */}
            </Routes>
        </div>
    </div>
  )
}

export default SAPIMain
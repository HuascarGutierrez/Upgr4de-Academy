import React from 'react'
import './styles/NavLateral.css'
import { useNavigate } from 'react-router-dom'

function NavLateral() {
    const navigate = useNavigate()
  return (
    <div className='navLateral'>
        <div onClick={() => {navigate('/')}} className='navLateral_logo'>
            <img src="/assets/buho_verde.svg" alt="" />
        </div>
        <div className='navLateral_content'>
            <ul className='navLateral_list'>
                <li onClick={() => {navigate('/main/courses')}} className='navLateral_item'>
                    <img src="/assets/navLateral_1.svg" alt="" />
                </li>
                <li onClick={() => {navigate('/main/catalogo')}} className='navLateral_item'>
                    <img src="/assets/navLateral_2.svg" alt="" />
                </li>
                <li onClick={() => {navigate('/main/supervision')}} className='navLateral_item'>
                    <img src="/assets/navLateral_3.svg" alt="" />
                </li>
                <li onClick={() => {navigate('/main/perfil')}} className='navLateral_item'>
                    <img src="/assets/navLateral_4.svg" alt="" />
                </li>
            </ul>
        </div>
    </div>
  )
}

export default NavLateral
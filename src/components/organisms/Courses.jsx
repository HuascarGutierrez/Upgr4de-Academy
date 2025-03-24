import React from 'react'
import "./styles/Courses.css"
import Calendario from '../molecules/Calendario'
import BarMyCourses from '../molecules/BarMyCourses'
import ProgresoCurso from '../molecules/ProgresoCurso'
import AllStatus from '../molecules/AllStatus'
import EnrolledCourses from './EnrolledCourses'

function Courses() {
  return (
  <div className='SAPIcurses'>
    <header className="catalog-header">
            <div className="logo"></div>
            <nav className="nav-bar">
              <input type="text" placeholder="Buscar cualquier cosa" className="search-input" />
              <div className="nav-links">
                <span>Mis Cursos</span>
                <span>Progreso</span>
                <span>🔔</span>
                <span>⚙️</span>
              </div>
            </nav>
          </header>

    <ProgresoCurso />
    <AllStatus />
    <EnrolledCourses />
  </div>
  )
}

export default Courses
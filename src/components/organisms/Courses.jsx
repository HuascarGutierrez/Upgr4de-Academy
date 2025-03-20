import React from 'react'
import "./styles/Courses.css"
import Calendario from '../molecules/Calendario'
import BarMyCourses from '../molecules/BarMyCourses'
import ProgresoCurso from '../molecules/ProgresoCurso'
import AllStatus from '../molecules/AllStatus'
import EnrolledCourses from './EnrolledCourses'

function Courses() {
  return (
  <div style={{overflowX: 'hidden'}}>
    <BarMyCourses/>
    <ProgresoCurso />
    <AllStatus />
    <EnrolledCourses />
  </div>
  )
}

export default Courses
import React from 'react'
import "./styles/Courses.css"
import Calendario from '../molecules/Calendario'
import BarMyCourses from '../molecules/BarMyCourses'
import ProgresoCurso from '../molecules/ProgresoCurso'
import AllStatus from '../molecules/AllStatus'
import EnrolledCourses from './EnrolledCourses'

function Courses() {
  return (
    <>
    <div>Courses</div>
    <BarMyCourses/>
    <ProgresoCurso />
    <AllStatus />
    <EnrolledCourses />
    </>
    
  )
}

export default Courses
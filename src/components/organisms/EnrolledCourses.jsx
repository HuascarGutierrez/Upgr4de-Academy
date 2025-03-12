import React from 'react'
import "./styles/Courses.css"
import EnrolledHeader from '../molecules/EnrolledHeader'
import UnidadesProgreso from '../molecules/UnidadesProgreso'

function EnrolledCourses() {
  return (
    <>
    <div className='Enrolled'>
        <EnrolledHeader />
        <UnidadesProgreso />
    </div>
    </>
  )
}

export default EnrolledCourses
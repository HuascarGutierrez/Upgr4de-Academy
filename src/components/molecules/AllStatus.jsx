import React from 'react'
import "./styles/AllStatus.css"

function AllStatus() {
  return (
    <>
        <div className='AllStatus'>
            <h2>All Status</h2>
            <div className='StatusP'>
                <div>
                    <img src="/assets/Icons-drawer_2.svg" alt="" />
                    <h3>3/7 cursos</h3>
                </div>
                <div>
                    <img src="/assets/app_registration.svg" alt="" />
                    <h3>30/70 Ejercios</h3>
                </div>
                <div>
                    <img src="/assets/stadia_controller.svg" alt="" />
                    <h3>2 prototipos</h3>
                </div>
                <div>
                    <img src="/assets/timelapse.svg" alt="" />
                    <h3>2 horas de apredizaje</h3>
                </div>
            </div>
        </div>
    </>
  )
}

export default AllStatus
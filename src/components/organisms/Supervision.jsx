import React from 'react'
import Foldersvg from '../atoms/Foldersvg'
import './styles/Supervision.css'
import Elementsvg from '../atoms/Elementsvg'

function Supervision() {
    
  return (
    <section className='supervision'>
        <div className='supervision_element supervision_temas_section'>
            <h3>Materias por avanzar</h3>
            <div className='supervision_temas'>
                <div className="temas_element element-blue">
                    <Foldersvg color={'blue'}/>
                    <p>Álgebra</p>
                </div>
                <div className="temas_element element-red">
                    <Foldersvg color={'red'}/>
                    <p>Cálculo</p>
                </div>
                <div className="temas_element element-orange">
                    <Foldersvg color={'orange'}/>
                    <p>Física</p>
                </div>
                <div className="temas_element element-green">
                    <Foldersvg color={'green'}/>
                    <p>Química</p>
                </div>
            </div>
        </div>
        <div className='supervision_element supervision_profile'>
            <h3>Mi perfil de usuario</h3>
            <div className='supervision_description'>
                <img src="/images/user_image.webp" alt="profile_photo" />
                <div className='supervision_info'>
                    <p>Maharrm Hasanli</p>
                    <p>maga.hesenli@gmail.com</p>
                </div>
                <div className='supervision_courses'>
                    <div className='courses-course'><p>Cursos:</p> <span>4</span></div>
                    <div className='courses-unit'><p>Unidades:</p> <span>10</span></div>
                </div>
            </div>
        </div>

        <div className='supervision_element supervision_dashboard'>
            <h3>Estadísticas</h3>
            <img src="/images/dashboard.webp" alt="" />
        </div>

        <div className='supervision_element supervision_materias'>
            <div className='supervision_card'>
                <img src="/assets/more-vertical.svg" alt="" />
                <Elementsvg/>
                <h4>Fisica</h4>
                <p>Práctico 20 minutos.</p>
            </div>

            <div className='supervision_card'>
                <img src="/assets/more-vertical.svg" alt="" />
                <Elementsvg/>
                <h4>Cálculo</h4>
                <p>Práctico 5 minutos.</p>
            </div>

            <div className='supervision_card'>
                <img src="/assets/more-vertical.svg" alt="" />
                <Elementsvg/>
                <h4>Álgebra</h4>
                <p>Práctico 10 minutos.</p>
            </div>

            <div className='supervision_card'>
                <img src="/assets/more-vertical.svg" alt="" />
                <Elementsvg/>
                <h4>Química</h4>
                <p>Práctico 25 minutos.</p>
            </div>
        </div>
    </section>
  )
}

export default Supervision
import React, { useState } from 'react'
import Foldersvg from '../atoms/Foldersvg'
import './styles/Supervision.css'
import Elementsvg from '../atoms/Elementsvg'
import { dataAlgebra, dataContentAlgebra, dataCalculo, dataContentCalculo, dataFisica, dataContentFisica, dataQuimica, dataContentQuimica } from '../../assets/dataAlgebra'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Supervision({user}) {
    const content = [
        'álgebra',
        'química',
        'física',
        'cálculo',
    ]
    const data = [
        {
          name: '20/01',
          álgebra: 22,
          química: 40,
          física: 24,
          cálculo: 24,
        },
        {
          name: '21/01',
          álgebra: 22,
          química: 30,
          física: 13,
          cálculo: 22,
        },
        {
          name: '22/01',
          álgebra: 22,
          química: 20,
          física: 98,
          cálculo: 22,
        },
        {
          name: '23/01',
          'álgebra': 22,
          química: 27,
          física: 39,
          cálculo: 20,
        },
        {
          name: '24/01',
          'álgebra': 22,
          química: 18,
          física: 48,
          cálculo: 21,
        },
        {
          name: '25/01',
          'álgebra': 22,
          química: 23,
          física: 38,
          cálculo: 25,
        },
        {
          name: '26/01',
          'álgebra': 22,
          química: 34,
          física: 43,
          cálculo: 21,
        },
      ];
    
    const [dataMostrada, setDataMostrada] = useState(data);
    const [contenidoMostrado, setContenidoMostrado] = useState(content);
    
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
                <img src={user?.imageUrl} alt="profile_photo" />
                <div className='supervision_info'>
                    <p>{user?.userName}</p>
                    <p>{user?.email}</p>
                </div>
                <div className='supervision_courses'>
                    <div className='courses-course'><p>Cursos:</p> <span>4</span></div> {/**agregar nombre de cursos  y de unidades */}
                    <div className='courses-unit'><p>Unidades:</p> <span>10</span></div>
                </div>
            </div>
        </div>

        <div className='supervision_element supervision_dashboard'>
            <h3>Estadísticas</h3>

            <button onClick={() => {setContenidoMostrado(content);setDataMostrada(data)}}>ver todos</button>
            <button onClick={() => {setContenidoMostrado(dataContentAlgebra);setDataMostrada(dataAlgebra)}}>ver algebra</button>
            <button onClick={() => {setContenidoMostrado(dataContentFisica);setDataMostrada(dataFisica)}}>ver fisica</button>
            <button onClick={() => {setContenidoMostrado(dataContentCalculo);setDataMostrada(dataCalculo)}}>ver calculo</button>
            <button onClick={() => {setContenidoMostrado(dataContentQuimica);setDataMostrada(dataQuimica)}}>ver quimica</button>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                width={500}
                height={300}
                data={dataMostrada}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 10,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend iconSize={20} layout='vertical'/>
                <Bar dataKey={contenidoMostrado[0]} stackId="a" fill="#158fa2" />
                <Bar dataKey={contenidoMostrado[1]} stackId="a" fill="#453c5c" />
                <Bar dataKey={contenidoMostrado[2]} stackId="a" fill="#076461" />
                <Bar dataKey={contenidoMostrado[3]} stackId="a" fill="#bd1b43" />
                </BarChart>
            </ResponsiveContainer>
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
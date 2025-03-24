import React, { useEffect, useState } from 'react'
import Foldersvg from '../atoms/Foldersvg'
import './styles/Supervision.css'
import Elementsvg from '../atoms/Elementsvg'
import { dataAlgebra, dataContentAlgebra, dataCalculo, dataContentCalculo, dataFisica, dataContentFisica, dataQuimica, dataContentQuimica } from '../../assets/dataAlgebra'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { db } from '../../config/app'
import { collection, getDocs } from 'firebase/firestore'

function Supervision({user}) {

    const [cursos, setCursos] = useState([])
    const [unidades, setUnidades] = useState(0);

    useEffect(()=>{
        const getDataCursosCollection = async() => {
             //aqui se revisa si esta enrolado
            const q2 = await collection(db, 'users',user.uid,'enrolledCourses');
            const querySnapshot2 = await getDocs(q2);

            if(!querySnapshot2.empty)
            {
                let contUnidades = 0;
                const cursosArray = querySnapshot2.docs.map((doc)=> doc.data());
                await setCursos(cursosArray);
                cursosArray.map((curso)=> {
                    if(curso.activo) contUnidades += curso.units.length
                })
                setUnidades(contUnidades);
            } else {
                //console.log('nada')
        }
        }

        getDataCursosCollection();
    },[])
    /**const content = [
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
      ]; */
    
    const [dataMostrada, setDataMostrada] = useState([]);
    const [contenidoMostrado, setContenidoMostrado] = useState([]);

    const reloadData = ({condicion=false, materia}) => {
        let content
        let contentTitle

        if(condicion) {
            switch(materia){
                case 'Álgebra': 
                    content = cursos.filter((doc) => doc.category === 'Álgebra' && doc.activo);
                break;
                case 'Química':
                    content = cursos.filter((doc) => doc.category === 'Química' && doc.activo);
                break;
                case 'Física':
                    content = cursos.filter((doc) => doc.category === 'Física' && doc.activo);
                break;
                case 'Cálculo':
                    content = cursos.filter((doc) => doc.category === 'Cálculo' && doc.activo);
                break;
                default: console.log('error en switch');
            }

            contentTitle = content.map((doc) => doc.title);
            setContenidoMostrado(contentTitle)

           // quantityByUnit = content.map((doc) => doc.units.length)
            //let mapeo = contentTitle.map()
            const resultado = content.reduce((acc, curso) => {
                acc[curso.title] = curso.units.filter(unit => unit.completed).length;
                return acc;
            }, { name: materia });
            const resuldatoArray = [resultado]
            setDataMostrada(resuldatoArray)
            console.log(resuldatoArray)

        } else {
            const content = [
                'Álgebra',
                'Química',
                'Física',
                'Cálculo',
            ]

            const data = [
                {
                    name: 'materias',
                    Álgebra: cursos
                        .filter((doc) => doc.category === 'Álgebra')
                        .reduce((acc, doc) => acc + doc.units.filter(unit => unit.completed).length, 0),
                    Química: cursos
                        .filter((doc) => doc.category === 'Química')
                        .reduce((acc, doc) => acc + doc.units.filter(unit => unit.completed).length, 0),
                    Física: cursos
                        .filter((doc) => doc.category === 'Física')
                        .reduce((acc, doc) => acc + doc.units.filter(unit => unit.completed).length, 0),
                    Cálculo: cursos
                        .filter((doc) => doc.category === 'Cálculo')
                        .reduce((acc, doc) => acc + doc.units.filter(unit => unit.completed).length, 0),
                }
            ];
            setContenidoMostrado(content);
            setDataMostrada(data);
        }
    }
    
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
                    <div className='courses-course'><p>Cursos:</p> <span>{cursos.length}</span></div> {/**agregar nombre de cursos  y de unidades */}
                    <div className='courses-unit'><p>Unidades:</p> <span>{unidades}</span></div>
                </div>
            </div>
        </div>

        <div className='supervision_element supervision_dashboard'>
            <h3>Estadísticas</h3>

            <section>
            <button onClick={() => {reloadData({condicion: false})}}>ver todos</button>
            {/**<button onClick={() => {setContenidoMostrado(dataContentAlgebra);setDataMostrada(dataAlgebra)}}>ver algebra</button> */}
            <button onClick={() => {reloadData({condicion: true, materia: 'Álgebra'})}}>ver álgebra</button>
            <button onClick={() => {reloadData({condicion: true, materia: 'Física'})}}>ver física</button>
            <button onClick={() => {reloadData({condicion: true, materia: 'Cálculo'})}}>ver cálculo</button>
            <button onClick={() => {reloadData({condicion: true, materia: 'Química'})}}>ver química</button>
            </section>

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
                {/**<Bar dataKey={contenidoMostrado[0]} stackId="a" fill="#158fa2" />
                <Bar dataKey={contenidoMostrado[1]} stackId="a" fill="#453c5c" />
                <Bar dataKey={contenidoMostrado[2]} stackId="a" fill="#076461" />
                <Bar dataKey={contenidoMostrado[3]} stackId="a" fill="#bd1b43" /> */}
                <Bar dataKey={contenidoMostrado[0]} fill="#158fa2" />
                <Bar dataKey={contenidoMostrado[1]} fill="#453c5c" />
                <Bar dataKey={contenidoMostrado[2]} fill="#076461" />
                <Bar dataKey={contenidoMostrado[3]} fill="#bd1b43" />
                </BarChart>
            </ResponsiveContainer>
        </div>

        <div className='supervision_element supervision_materias'>
            {/**<div className='supervision_card'>
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
            </div> */}
            <h3>Notificaciones</h3>
            <p>Sin Notificaciones</p>
        </div>
    </section>
  )
}

export default Supervision
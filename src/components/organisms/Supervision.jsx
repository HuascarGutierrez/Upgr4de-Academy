import React, { useEffect, useState } from 'react'
import Foldersvg from '../atoms/Foldersvg'
import './styles/Supervision.css'
import Elementsvg from '../atoms/Elementsvg'
import { dataAlgebra, dataContentAlgebra, dataCalculo, dataContentCalculo, dataFisica, dataContentFisica, dataQuimica, dataContentQuimica } from '../../assets/dataAlgebra'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { db } from '../../config/app'
import { collection, getDocs, query, where } from 'firebase/firestore'

import { PieChart, Pie, Sector, Cell } from 'recharts';

import renderCustomizedLabel from './ChartPie'

import { Tooltip as RechartsTooltip } from 'recharts';

function Supervision({user}) {

    const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'var(--swans-down-100)',
          border: '5px solidrgb(216, 173, 132)',
          borderRadius: '10px',
          padding: '20px 30px',
          fontSize: '1.5rem',
          minWidth: '180px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}
      >
        <p style={{ fontWeight: 'bold', marginBottom: 10 }}>{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ color: entry.color, margin: 0 }}>
            {entry.name}: <span style={{ fontWeight: 'bold' }}>{entry.value}%</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};
    const CustomTooltip2 = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'var(--brandy-punch-100)',
          border: '5px solidrgb(216, 173, 132)',
          borderRadius: '10px',
          padding: '20px 30px',
          fontSize: '1.75rem',
          minWidth: '180px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}
      >
        <p style={{ fontWeight: 'bold', marginBottom: 10 }}>{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ color: entry.color, margin: 0 }}>
            {entry.name}: <span style={{ fontWeight: 'bold' }}>{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

    const [cursos, setCursos] = useState([]);
    const [cursosActivos, setCursosActivos] = useState(0);

    const [unidades, setUnidades] = useState(0);
    
    const [dataEjercicios, setDataEjercicios] = useState([]);
    const [dataCursoPorMaterias, setDataCursoPorMaterias] = useState([]);



    const COLORSPIE = ['#0088FE', '#00C49F'];
    const COLORSMATERIAS = [
        '#158fa2', // azul oscuro
        '#453c5c', // morado oscuro
        '#076461', // verde azulado
        '#bd1b43', // rojo vino
        '#2c3e50', // azul petróleo
        '#4b2c2c', // marrón oscuro
        '#0f3057', // azul profundo
        '#3d3b8e', // índigo oscuro
        '#1c1c3c', // púrpura negruzco
        '#2f4858', // gris azulado
        '#37474f', // gris carbón
        '#512b58', // violeta oscuro
        '#1a2e35', // verde oscuro
        '#3a0ca3', // azul púrpura
        '#560bad'  // violeta profundo
        ];



    useEffect(()=>{
        const getEjerciciosCompletadosYTotales = async() => {
        const progresoQuery = query(collection(db, 'progress'), where('userId', '==', user.uid));
        getDocs(progresoQuery).then((querySnapshot) => {
            let totalCompletados = 0;
            let totalEjercicios = 0;
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                totalCompletados += data.ejerciciosCompletados
                totalEjercicios += data.totalEjercicios
            });
            
            setDataEjercicios([
                { name: 'Ejercicios Completados', value: totalCompletados },
                { name: 'Ejercicios Faltantes', value: totalEjercicios - totalCompletados }
            ]);

        }).catch((error) => {
            console.error("Error al obtener los ejercicios:", error);
        });
    }

        const getDataCursosCollection = async() => {
             //aqui se revisa si esta enrolado
            const q2 = await collection(db, 'users',user.uid,'enrolledCourses');
            const querySnapshot2 = await getDocs(q2);

            if(!querySnapshot2.empty)
            {
                let contUnidades = 0;
                const cursosArray = querySnapshot2.docs.map((doc)=> doc.data());
                await setCursos(cursosArray);
                await setCursosActivos(cursosArray.filter(curso => curso.activo).length);
                cursosArray.map((curso)=> {
                    if(curso.activo) contUnidades += curso.units.length
                })
                setUnidades(contUnidades);

                //contar los cursos por materias
                const dataCursoPorMaterias = cursosArray.reduce((acc, curso) => {
                    const materia = curso.category;
                    if (!acc[materia]) {
                        acc[materia] = { name: materia, value: 0 };
                    }
                    if (curso.activo) {
                        acc[materia].value += 1;
                    }
                    return acc;
                }, {});
                const dataCursoPorMateriasArray = Object.values(dataCursoPorMaterias);
                setDataCursoPorMaterias(dataCursoPorMateriasArray);
                console.log('para el pie',dataCursoPorMateriasArray);
            } else {
                //console.log('nada')
        }
        }

        getDataCursosCollection();
        getEjerciciosCompletadosYTotales();
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
                acc[curso.title] = curso.units.filter(unit => unit.completed).length/ curso.units.length * 100;
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

            const materias = ['Álgebra', 'Química', 'Física', 'Cálculo'];


            const data = [{
            name: 'materias',
            ...materias.reduce((acc, mat) => {
                const cursosMateria = cursos.filter((doc) => doc.category === mat && doc.activo);
                const totalUnidades = cursosMateria.reduce((sum, curso) => sum + (curso.units?.length || 0), 0);
                const completadas = cursosMateria.reduce((sum, curso) => sum + (curso.units?.filter(unit => unit.completed).length || 0), 0);
                acc[mat] = totalUnidades > 0 ? Math.round((completadas / totalUnidades) * 100) : 0;
                return acc;
            }, {})
        }];
            setContenidoMostrado(content);
            setDataMostrada(data);
        }
    }

    /**const getDataMostradaPorcentajes = (dataMostrada) => {
    if (!dataMostrada || dataMostrada.length === 0) return [];
    const materias = ['Álgebra', 'Química', 'Física', 'Cálculo'];
    const total = materias.reduce((acc, mat) => acc + (dataMostrada[0][mat] || 0), 0);
    if (total === 0) return dataMostrada; // Evita división por cero

    const dataPorcentajes = [{
        name: dataMostrada[0].name,
        ...materias.reduce((acc, mat) => {
            acc[mat] = Math.round(((dataMostrada[0][mat] || 0) / total) * 100);
            return acc;
        }, {})
    }];
    return dataPorcentajes;
}; */

const getUnidadesNoCompletadas = () => {
  let cursosFiltrados = cursos;
  if (contenidoMostrado.length === 1 && contenidoMostrado[0] !== 'materias') {
    // Si está filtrado por materia
    cursosFiltrados = cursos.filter(curso => curso.category === contenidoMostrado[0] && curso.activo);
    console.log('content ', contenidoMostrado)
  }
  // Si está en "ver todos", cursos ya es el array completo

  // Extrae unidades no completadas
  let unidadesNoCompletadas = [];
  cursosFiltrados.forEach(curso => {
    curso.units.forEach(unit => {
      if (!unit.completed) {
        unidadesNoCompletadas.push({
          nombre: unit.nombreUnidad,
          category: curso.category,
          title: curso.title
        });
      }
    });
  });
  return unidadesNoCompletadas;
};
    
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
                    <div className='courses-course'><p>Activo:</p> <span>{user?.activo?"SI":"NO"}</span></div> {/**agregar nombre de cursos  y de unidades */}
                    <div className='courses-course'><p>Cursos:</p> <span>{cursosActivos}</span></div> {/**agregar nombre de cursos  y de unidades */}
                    <div className='courses-unit'><p>Unidades:</p> <span>{unidades}</span></div>

                    <PieChart width={350} height={350}>
                    <Pie
                        data={dataCursoPorMaterias}
                        cx={200}
                        cy={150}
                        labelLine={false}
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {dataEjercicios.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORSMATERIAS[index % COLORSMATERIAS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip2/>} />
                    <Legend />
                    </PieChart>
                </div>
            </div>
        </div>

        <div className='supervision_element supervision_dashboard'>
            <h2 className='supervision_title'>Supervisión</h2>
            <h3>Parte teórica completada</h3>

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
                barSize={250}
                >
                
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip content={<CustomTooltip/>} />
                <Legend iconSize={20} layout='vertical'/>
                {/**<Bar dataKey={contenidoMostrado[0]} stackId="a" fill="#158fa2" />
                <Bar dataKey={contenidoMostrado[1]} stackId="a" fill="#453c5c" />
                <Bar dataKey={contenidoMostrado[2]} stackId="a" fill="#076461" />
                <Bar dataKey={contenidoMostrado[3]} stackId="a" fill="#bd1b43" /> */}
                {contenidoMostrado.map((key, idx) => (
                    <Bar
                        key={key}
                        dataKey={key}
                        fill={COLORSMATERIAS[idx % COLORSMATERIAS.length]}
                    />
                    ))}
                </BarChart>
            </ResponsiveContainer>
            <div>
  <h4>Unidades teóricas por cumplir</h4>
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr>
        <th style={{ border: '1px solid #ccc', padding: '4px' }}>Nombre</th>
        <th style={{ border: '1px solid #ccc', padding: '4px' }}>Categoría</th>
        <th style={{ border: '1px solid #ccc', padding: '4px' }}>Curso</th>
      </tr>
    </thead>
    <tbody>
      {getUnidadesNoCompletadas().map((unit, idx) => (
        <tr key={idx}>
          <td style={{ border: '1px solid #ccc', padding: '4px' }}>{unit.nombre}</td>
          <td style={{ border: '1px solid #ccc', padding: '4px' }}>{unit.category}</td>
          <td style={{ border: '1px solid #ccc', padding: '4px' }}>{unit.title}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
        </div>

        <div className='supervision_element supervision_materias supervision_ejercicios'>
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
            <h3>Ejercicios</h3>
            <div className='ejercicios-info'>
                <p className='info-text'>Ejercicios Completados: {dataEjercicios[0]?.value}</p>
                <p className='info-text'>Ejercicios Faltantes: {dataEjercicios[1]?.value}</p>
                <p className='info-text'>Ejercicios Totales: {dataEjercicios[1]?.value + dataEjercicios[0]?.value}</p>
            </div>
            <div className='ejercicios-chart'>
                <PieChart width={350} height={350}>
                    <Pie
                        data={dataEjercicios}
                        cx={200}
                        cy={150}
                        labelLine={false}
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {dataEjercicios.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORSPIE[index % COLORSPIE.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip2/>} />
                    <Legend />
                    </PieChart>

            </div>
        </div>
    </section>
  )
}

export default Supervision
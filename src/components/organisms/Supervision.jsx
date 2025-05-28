// src/components/Supervision.jsx
import React, { useEffect, useState } from 'react';
import Foldersvg from '../atoms/Foldersvg';
import './styles/Supervision.css';
import Elementsvg from '../atoms/Elementsvg';
import { dataAlgebra, dataContentAlgebra, dataCalculo, dataContentCalculo, dataFisica, dataContentFisica, dataQuimica, dataContentQuimica } from '../../assets/dataAlgebra';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { db } from '../../config/app';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { PieChart, Pie, Sector, Cell } from 'recharts';
import renderCustomizedLabel from './ChartPie'; // Asegúrate de que este import sea correcto
import { Tooltip as RechartsTooltip } from 'recharts';

function Supervision({ user, onDataLoaded }) {

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
    const [unidadesCompletadasCount, setUnidadesCompletadasCount] = useState(0); // Estado para unidades completadas
    const [unidadesTotalesCount, setUnidadesTotalesCount] = useState(0); // Estado para unidades totales

    const [dataEjercicios, setDataEjercicios] = useState([]);
    const [ejerciciosCompletados, setEjerciciosCompletados] = useState(0); // Estado para ejercicios completados
    const [totalEjercicios, setTotalEjercicios] = useState(0); // Estado para total ejercicios

    const [dataCursoPorMaterias, setDataCursoPorMaterias] = useState([]);

    const [contentT, setContentT] = useState([]);

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

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user.uid) {
                console.log("Usuario no disponible para cargar datos de supervisión.");
                // Notificar al padre con valores por defecto si no hay usuario
                if (onDataLoaded) {
                    onDataLoaded({
                        cursosActivos: 0,
                        unidadesCompletadas: 0,
                        ejerciciosCompletados: 0,
                        forumContributions: 0, // Asegurarse de enviar 0 si no hay usuario
                    });
                }
                return;
            }

            let currentEjerciciosCompletados = 0;
            let currentTotalEjercicios = 0;
            let currentCursosActivos = 0;
            let currentUnidadesCompletadas = 0;
            let currentUnidadesTotales = 0;
            let currentForumContributions = 0; // Añadimos la variable para las contribuciones

            // 1. Obtener datos de ejercicios
            try {
                const progresoQuery = query(collection(db, 'progress'), where('userId', '==', user.uid));
                const querySnapshot = await getDocs(progresoQuery);
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    currentEjerciciosCompletados += data.ejerciciosCompletados || 0;
                    currentTotalEjercicios += data.totalEjercicios || 0;
                });

                setDataEjercicios([
                    { name: 'Ejercicios Completados', value: currentEjerciciosCompletados },
                    { name: 'Ejercicios Faltantes', value: currentTotalEjercicios - currentEjerciciosCompletados }
                ]);
                setEjerciciosCompletados(currentEjerciciosCompletados);
                setTotalEjercicios(currentTotalEjercicios);

            } catch (error) {
                console.error("Error al obtener los ejercicios en Supervision:", error);
            }

            // 2. Obtener datos de cursos y unidades
            try {
                const q2 = collection(db, 'users', user.uid, 'enrolledCourses');
                const querySnapshot2 = await getDocs(q2);

                if (!querySnapshot2.empty) {
                    const cursosArray = querySnapshot2.docs.map((doc) => doc.data());
                    setCursos(cursosArray); // Guarda el array de cursos en el estado de Supervision
                    currentCursosActivos = cursosArray.filter(curso => curso.activo).length;
                    setCursosActivos(currentCursosActivos);

                    let tempUnidadesCompletadas = 0;
                    let tempUnidadesTotales = 0;
                    cursosArray.forEach((curso) => {
                        if (curso.activo) {
                            if (curso.units) {
                                tempUnidadesTotales += curso.units.length;
                                tempUnidadesCompletadas += curso.units.filter(unit => unit.completed).length;
                            }
                        }
                    });
                    setUnidadesCompletadasCount(tempUnidadesCompletadas);
                    setUnidadesTotalesCount(tempUnidadesTotales);
                    currentUnidadesCompletadas = tempUnidadesCompletadas; // Asignar para pasar al padre

                    // Contar los cursos por materias
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
                } else {
                    setCursos([]);
                    setCursosActivos(0);
                    setUnidadesCompletadasCount(0);
                    setUnidadesTotalesCount(0);
                    setDataCursoPorMaterias([]);
                }
            } catch (error) {
                console.error("Error al obtener datos de cursos en Supervision:", error);
            }

            // 3. Obtener datos de contribuciones al foro
            try {
                // Asume que las contribuciones al foro están en una colección 'forum_activity'
                // y que cada documento tiene un 'userId' y un 'type' de 'contribution'
                const forumRef = collection(db, 'forum_activity');
                const q = query(forumRef, where('userId', '==', user.uid), where('type', '==', 'contribution'));
                const snapshot = await getDocs(q);
                currentForumContributions = snapshot.docs.length;
            } catch (error) {
                console.error("Error fetching forum contributions:", error);
                currentForumContributions = 0; // Asegurarse de que sea 0 en caso de error
            }

            // 4. Notificar al componente padre que los datos están cargados
            // Pasa solo los datos que el componente padre (Dashboard) necesita para la gamificación
            if (onDataLoaded) {
                onDataLoaded({
                    cursosActivos: currentCursosActivos,
                    unidadesCompletadas: currentUnidadesCompletadas, // Usar el valor acumulado
                    ejerciciosCompletados: currentEjerciciosCompletados, // Usar el valor acumulado
                    forumContributions: currentForumContributions, // Pasar las contribuciones del foro
                });
            }
        };

        fetchData();
    }, [user, onDataLoaded]); // onDataLoaded también como dependencia si es una función con useCallback

    const [dataMostrada, setDataMostrada] = useState([]);
    const [contenidoMostrado, setContenidoMostrado] = useState([]);
    const [categoriaG, setCategoriaG] = useState(null);

    // Esta función maneja la lógica de los botones para el gráfico de barras
    const reloadData = ({ condicion = false, materia }) => {
        setCategoriaG(materia);
        let contentTitle;
        let dataToDisplay;

        if (condicion) {
            let content;
            switch (materia) {
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
                default:
                    console.log('error en switch');
                    content = [];
            }

            contentTitle = content.map((doc) => doc.title);
            setContenidoMostrado(contentTitle);
            setContentT(content);

            const resultado = content.reduce((acc, curso) => {
                const completedUnits = curso.units ? curso.units.filter(unit => unit.completed).length : 0;
                const totalUnits = curso.units ? curso.units.length : 0;
                acc[curso.title] = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;
                return acc;
            }, { name: materia });
            dataToDisplay = [resultado];
            setDataMostrada(dataToDisplay);

        } else { // "Ver todos"
            setCategoriaG(null);
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
            setContenidoMostrado(materias);
            setDataMostrada(data);
        }
    };

    // Función para obtener unidades no completadas (usada en la tabla)
    const getUnidadesNoCompletadas = () => {
        let unidadesNoCompletadas = [];
        cursos.forEach(curso => { // Utiliza el estado 'cursos' de Supervision
            if (curso.units) {
                curso.units.forEach(unit => {
                    if (!unit.completed) {
                        unidadesNoCompletadas.push({
                            nombre: unit.nombreUnidad, // Asegúrate de que el nombre de la unidad sea 'nombreUnidad'
                            category: curso.category,
                            title: curso.title
                        });
                    }
                });
            }
        });
        return unidadesNoCompletadas;
    };

    // Inicializa el gráfico de barras al cargar el componente
    useEffect(() => {
        // Solo recargar si 'cursos' tiene datos, para evitar ejecución redundante al inicio
        if (cursos.length > 0) {
            reloadData({ condicion: false }); // Carga la vista "ver todos" por defecto
        }
    }, [cursos]); // Depende de que 'cursos' esté cargado por el useEffect principal

    return (
        <section className='supervision'>
            <div className='supervision_element supervision_temas_section'>
                <h3>Materias por avanzar</h3>
                <div className='supervision_temas'>
                    <div className="temas_element element-blue">
                        <Foldersvg color={'blue'} />
                        <p>Álgebra</p>
                    </div>
                    <div className="temas_element element-red">
                        <Foldersvg color={'red'} />
                        <p>Cálculo</p>
                    </div>
                    <div className="temas_element element-orange">
                        <Foldersvg color={'orange'} />
                        <p>Física</p>
                    </div>
                    <div className="temas_element element-green">
                        <Foldersvg color={'green'} />
                        <p>Química</p>
                    </div>
                </div>
            </div>
            <div className='supervision_element supervision_profile'>
                <div className='supervision_description'>
                    <img src={user?.imageUrl} alt="profile_photo" />
                    <div className='supervision_info'>
                        <h3>Rendimiento de los cursos</h3>
                    </div>
                    <div className='supervision_courses'>
                        <div className='courses-course'><p>Activo:</p> <span>{user?.activo ? "SI" : "NO"}</span></div>
                        <div className='courses-course'><p>Cursos:</p> <span>{cursosActivos}</span></div>
                        <div className='courses-unit'><p>Unidades:</p> <span>{unidadesCompletadasCount}/{unidadesTotalesCount}</span></div>

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
                                {dataCursoPorMaterias.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORSMATERIAS[index % COLORSMATERIAS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip2 />} />
                            <Legend />
                        </PieChart>
                    </div>
                </div>
            </div>

            <div className='supervision_element supervision_dashboard'>
                <h2 className='supervision_title'>Supervisión</h2>
                <h3>Parte teórica completada</h3>

                <section>
                    <button onClick={() => { reloadData({ condicion: false }) }}>ver todos</button>
                    <button onClick={() => { reloadData({ condicion: true, materia: 'Álgebra' }) }}>ver álgebra</button>
                    <button onClick={() => { reloadData({ condicion: true, materia: 'Física' }) }}>ver física</button>
                    <button onClick={() => { reloadData({ condicion: true, materia: 'Cálculo' }) }}>ver cálculo</button>
                    <button onClick={() => { reloadData({ condicion: true, materia: 'Química' }) }}>ver química</button>
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
                        <Tooltip content={<CustomTooltip />} />
                        <Legend iconSize={20} layout='vertical' />
                        {contenidoMostrado.map((key, idx) => (
                            <Bar
                                key={key}
                                dataKey={key}
                                fill={COLORSMATERIAS[idx % COLORSMATERIAS.length]}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
                <div className='tablaSupervision'>
                    <h4 className='tabla_title'>Unidades teóricas por cumplir</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th className='encabezadoSupervision' style={{ border: '1px solid #ccc', padding: '4px' }}>Nombre</th>
                                <th className='encabezadoSupervision' style={{ border: '1px solid #ccc', padding: '4px' }}>Categoría</th>
                                <th className='encabezadoSupervision' style={{ border: '1px solid #ccc', padding: '4px' }}>Curso</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categoriaG != null ? getUnidadesNoCompletadas().map((unit, idx) => categoriaG == unit.category && (
                                <tr className='textSupervision' key={idx}>
                                    <td style={{ border: '1px solid #ccc', padding: '4px' }}>{unit.nombre}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '4px' }}>{unit.category}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '4px' }}>{unit.title}</td>
                                </tr>
                            )) :
                                getUnidadesNoCompletadas().map((unit, idx) => (
                                    <tr className='textSupervision' key={idx}>
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
                <h3>Vista de ejercicios</h3>
                <div className='ejercicios-info'>
                    <p className='info-text'>Ejercicios Completados: {ejerciciosCompletados}</p>
                    <p className='info-text'>Ejercicios Faltantes: {totalEjercicios - ejerciciosCompletados}</p>
                    <p className='info-text'>Ejercicios Totales: {totalEjercicios}</p>
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
                        <Tooltip content={<CustomTooltip2 />} />
                        <Legend />
                    </PieChart>
                </div>
            </div>
        </section>
    );
}

export default Supervision;
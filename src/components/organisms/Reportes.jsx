import React, { useState, useEffect } from 'react';
import './styles/Reportes.css';
import { db } from "../../config/app";
import { collection, getDocs } from "firebase/firestore";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import CourseModel from '../../models/course_model';

// Constantes y helpers separados
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const LOGO_BASE64 = 'data:image/png;base64,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';

// Componente para mostrar alertas por materia
const AlertCard = ({ materia, inscritos, minimo }) => {
  let estado = 'verde';
  let mensaje = 'Demanda estable';

  if (inscritos < minimo) {
    estado = 'rojo';
    mensaje = 'Inscritos por debajo del mínimo esperado';
  } else if (inscritos === minimo) {
    estado = 'amarillo';
    mensaje = 'Justo en el mínimo, observar comportamiento';
  }

  return (
    <div className="alert-card">
      <div className="alert-header">
        <span className={`estado-circulo ${estado}`}></span>
        <h3>{materia}</h3>
      </div>
      <div className="alert-body">
        <p><strong>Inscritos:</strong> {inscritos}</p>
        <p><strong>Mínimo esperado:</strong> {minimo}</p>
        <p className="alert-message">{mensaje}</p>
      </div>
    </div>
  );
};

// Componente para el selector de fecha
const DateSelector = ({ mes, año, setMes, setAño, onPreview, onGenerate, previewActive, onGenerateReportPlanPagos, planPagosPdf, onPreviewReportPlan, onRefresh }) => {
  return (
    <div className="contenedor-titulo-filtros">
      <p className="filtro-title">Seleccione un mes y un año</p>
      <div className="filtros-contenedor">
        <select value={mes} onChange={(e) => setMes(e.target.value)}>
          <option value="">Selecciona un mes</option>
          {MESES.map((m, i) => (
            <option key={i} value={m}>{m}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Año"
          value={año}
          onChange={(e) => setAño(e.target.value)}
          min="2000"
          max="2100"
        />

        <div className="container-buttons">
          <button
            onClick={onPreview}
            disabled={!mes || !año}
            className="boton-filtro"
          >
            Ver reporte general
          </button>
          <button
            onClick={onGenerate}
            disabled={!mes || !año || !previewActive}
            className="boton-filtro"
          >
            Generar PDF
          </button>
        </div>

        <div className="container-buttons">
          <button
            onClick={onGenerateReportPlanPagos}
            disabled={!mes || !año}
            className="boton-filtro"
          >
            Ver reporte de plan de pagos
          </button>
          <button
            onClick={planPagosPdf}
            disabled={!mes || !año || !onPreviewReportPlan}
            className="boton-filtro"
          >
            Generar PDF
          </button>
        </div>

        <button
          onClick={onRefresh}
          className="boton-filtro"
        >
          Actualizar Datos
        </button>
      </div>
    </div>
  );
};

const Reportes = () => {
  // Estados
  const [recomendaciones, setRecomendaciones] = useState('Sin recomendaciones');
  const [mes, setMes] = useState('');
  const [año, setAño] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewActive, setPreviewActive] = useState(false);
  
  const [coursesData, setCoursesData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [teachersData, setTeachersData] = useState([]);
  const [usersInSelectedMonth, setUsersInSelectedMonth] = useState(0);

  const [showPlansReport, setShowPlansReport] = useState(false);
  
  const [alumnosPorMateria, setAlumnosPorMateria] = useState({
    'Álgebra': 0,
    'Cálculo': 0,
    'Física': 0,
    'Química': 0
  });

  // Datos para el reporte
  const materias = [
    { 
      nombre: 'Álgebra', 
      porcentajeInscritos: `${(alumnosPorMateria['Álgebra'] / Math.max(1, usersData.length) * 100).toFixed(1)}%`, 
      inscritos: alumnosPorMateria['Álgebra'], 
      cursos: coursesData.filter(c => c.subject === 'Álgebra' || c.category === 'Álgebra').length || 8, 
      minimoEsperado: 100
    },
    { 
      nombre: 'Cálculo', 
      porcentajeInscritos: `${(alumnosPorMateria['Cálculo'] / Math.max(1, usersData.length) * 100).toFixed(1)}%`, 
      inscritos: alumnosPorMateria['Cálculo'], 
      cursos: coursesData.filter(c => c.subject === 'Cálculo' || c.category === 'Cálculo').length || 8, 
      minimoEsperado: 100
    },
    { 
      nombre: 'Física', 
      porcentajeInscritos: `${(alumnosPorMateria['Física'] / Math.max(1, usersData.length) * 100).toFixed(1)}%`, 
      inscritos: alumnosPorMateria['Física'], 
      cursos: coursesData.filter(c => c.subject === 'Física' || c.category === 'Física').length || 8, 
      minimoEsperado: 100
    },
    { 
      nombre: 'Química', 
      porcentajeInscritos: `${(alumnosPorMateria['Química'] / Math.max(1, usersData.length) * 100).toFixed(1)}%`, 
      inscritos: alumnosPorMateria['Química'], 
      cursos: coursesData.filter(c => c.subject === 'Química' || c.category === 'Química').length || 8, 
      minimoEsperado: 100
    }
  ];

  // Función para obtener datos de Firebase
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Obtener datos de cursos
      const coursesSnap = await getDocs(collection(db, 'courses'));
      const cursos = coursesSnap.docs.map(doc => {
        return typeof CourseModel !== 'undefined' 
          ? CourseModel.fromJson({ id: doc.id, ...doc.data() }) 
          : { id: doc.id, ...doc.data() };
      });
      setCoursesData(cursos);
      
      // 2. Obtener datos de usuarios
      const usersSnap = await getDocs(collection(db, 'users'));
      const usuarios = await Promise.all(usersSnap.docs.map(async (userDoc) => {
        const userData = { id: userDoc.id, ...userDoc.data() };
        
        try {
          const enrolledCoursesSnap = await getDocs(collection(db, 'users', userDoc.id, 'enrolledCourses'));
          userData.enrolledCoursesDocuments = enrolledCoursesSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } catch (error) {
          console.error(`Error al obtener cursos inscritos para usuario ${userDoc.id}:`, error);
          userData.enrolledCoursesDocuments = [];
        }
        
        return userData;
      }));
      setUsersData(usuarios);
      
      // 3. Obtener datos de profesores
      const teachersSnap = await getDocs(collection(db, 'teacher'));
      const profesores = teachersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTeachersData(profesores);
      
      // 4. Calcular alumnos por materia
      calcularAlumnosPorMateria(usuarios);
      
    } catch (error) {
      console.error('Error al obtener datos:', error);
      alert('Ocurrió un error al cargar los datos de la base de datos.');
    }
    setLoading(false);
  };
  
  // Función para calcular alumnos por materia
  const calcularAlumnosPorMateria = (usuarios) => {
    const contadorMaterias = {
      'Álgebra': 0,
      'Cálculo': 0,
      'Física': 0,
      'Química': 0,
      'Sin categorizar': 0
    };
    
    const usuariosPorMateria = {
      'Álgebra': new Set(),
      'Cálculo': new Set(),
      'Física': new Set(),
      'Química': new Set(),
      'Sin categorizar': new Set()
    };
    
    usuarios.forEach(usuario => {
      if (usuario.enrolledCoursesDocuments?.length > 0) {
        usuario.enrolledCoursesDocuments.forEach(enrolledCourse => {
          if (enrolledCourse.category) {
            const categoria = enrolledCourse.category;
            
            if (contadorMaterias[categoria] !== undefined && !usuariosPorMateria[categoria].has(usuario.id)) {
              contadorMaterias[categoria]++;
              usuariosPorMateria[categoria].add(usuario.id);
            } else if (!usuariosPorMateria['Sin categorizar'].has(usuario.id)) {
              contadorMaterias['Sin categorizar']++;
              usuariosPorMateria['Sin categorizar'].add(usuario.id);
            }
          }
        });
      }
    });
    
    setAlumnosPorMateria(contadorMaterias);
  };
  
  // Efecto para cargar datos al montar el componente
  useEffect(() => {
    fetchData();
  }, []);

  // Manejadores de eventos
  const handleRecomendacionesChange = (e) => {
    const valor = e.target.value;
    setRecomendaciones(valor.trim() === '' ? 'Sin recomendaciones' : valor);
  };

  // Función para parsear fechas
  const parsearFechaUsuario = (fechaStr) => {
    if (!fechaStr) return null;
    
    try {
      // Intenta analizar primero como objeto Timestamp de Firebase
      if (typeof fechaStr === 'object' && fechaStr.toDate) {
        const fecha = fechaStr.toDate();
        return {
          dia: fecha.getDate(),
          mes: fecha.getMonth(),
          mesNombre: MESES[fecha.getMonth()].toLowerCase(),
          año: fecha.getFullYear()
        };
      }
      
      // Si es una cadena, intenta varios formatos posibles
      if (typeof fechaStr === 'string') {
        // Formato "29 de marzo de 2025, 9:23:33 p.m. UTC-4"
        const patronFechaEspañol = /(\d+) de ([a-zñáéíóú]+) de (\d+)/i;
        const matchEspañol = fechaStr.toLowerCase().match(patronFechaEspañol);
        
        if (matchEspañol) {
          const dia = parseInt(matchEspañol[1]);
          const mesNombre = matchEspañol[2].toLowerCase();
          const año = parseInt(matchEspañol[3]);
          
          // Normalizar acentos
          const mesNormalizado = mesNombre
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
          
          const mesNumero = MESES.findIndex(m => 
            m.toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "") === mesNormalizado
          );
          
          if (mesNumero !== -1) {
            return { dia, mes: mesNumero, mesNombre, año };
          }
        }
        
        // Formato ISO (2025-03-29)
        const fecha = new Date(fechaStr);
        if (!isNaN(fecha.getTime())) {
          return {
            dia: fecha.getDate(),
            mes: fecha.getMonth(),
            mesNombre: MESES[fecha.getMonth()].toLowerCase(),
            año: fecha.getFullYear()
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error al parsear fecha:", error, "para la cadena:", fechaStr);
      return null;
    }
  };

  // Función para previsualizar reporte
  const handlePreview = () => {
    if (!mes || !año) return;
    
    const mesSeleccionadoNum = MESES.findIndex(m => m === mes);
    const añoSeleccionado = parseInt(año);
    
    const usuariosEnMesSeleccionado = usersData.filter(user => {
      const fechaCreacion = parsearFechaUsuario(user.createdAt);
      return fechaCreacion?.mes === mesSeleccionadoNum && fechaCreacion?.año === añoSeleccionado;
    });
    
    setUsersInSelectedMonth(usuariosEnMesSeleccionado.length);
    setPreviewActive(true);
  };

  // Función para generar PDF
  const handleGeneratePDF = () => {
    if (!mes || !año) return;
    
    const doc = new jsPDF();
    let currentY = 20;
    const marginLeft = 14;
    
    doc.addImage(LOGO_BASE64, 'PNG', marginLeft, 10, 30, 30); 
    currentY = 45;

    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = pageWidth - 2 * marginLeft;

    // Función auxiliar para añadir espacio vertical
    const addSpace = (space = 10) => {
      currentY += space;
      return currentY;
    };
    
    // Verificamos si hay que crear una nueva página
    const checkPage = (requiredSpace) => {
      if (currentY + requiredSpace > 280) {
        doc.addPage();
        currentY = 20;
        return true;
      }
      return false;
    };
    
    // === Título y período ===
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte Ejecutivo de la Plataforma Educativa SAPI', pageWidth / 2, currentY, null, null, 'center');
    addSpace();
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Período: ${mes} - ${año}`, pageWidth / 2, addSpace(), null, null, 'center');
    addSpace(15);
    
    // === 1. Resumen General ===
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Resumen General', marginLeft, currentY);
    addSpace(10);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`• Usuarios registrados: ${usersData.length}`, marginLeft + 5, currentY);
    doc.text(`• Usuarios registrados en este mes: ${usersInSelectedMonth}`, marginLeft + 5, addSpace(6));
    doc.text(`• Total de maestros: ${teachersData.length}`, marginLeft + 5, addSpace(6));
    doc.text(`• Total de cursos: ${coursesData.length}`, marginLeft + 5, addSpace(6));
    doc.text(`• Evaluación promedio de satisfacción: Pendiente`, marginLeft + 5, addSpace(6));
    addSpace(15);
    
    // === 2. Desglose Por Materia ===
    checkPage(60);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Desglose Por Materia', marginLeft, currentY);
    addSpace(5);
    
    // Tabla de materias
    const materiasTabla = materias.map(m => [
      m.nombre, 
      m.porcentajeInscritos, 
      m.inscritos, 
      m.cursos
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['Materia', 'Porcentaje de inscritos', 'Inscritos', 'Cursos']],
      body: materiasTabla,
      theme: 'striped',
      headStyles: { fillColor: [75, 75, 75] },
      margin: { left: marginLeft }
    });
    
    currentY = doc.lastAutoTable.finalY + 15;
    
    // Pie de página con fecha de generación
    doc.setFontSize(8);
    doc.text(`Reporte generado el ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, 285, null, null, 'center');
    
    // Guardar PDF
    doc.save(`reporte_sapi_${mes}_${año}.pdf`);
  };

  ///////////////////////////////////////////////////////////////////////////////////////////
  // Componente para el reporte de planes
  const PlanesReport = ({ usersData }) => {
    // Calcular estadísticas de planes
    const totalUsers = usersData.length;
    const freePlanUsers = usersData.filter(user => user.planType === 'Gratuito').length;
    const monthlyPlanUsers = usersData.filter(user => user.planType === 'Mensual').length;
    
    const freePercentage = totalUsers > 0 ? ((freePlanUsers / totalUsers) * 100).toFixed(1) : 0;
    const monthlyPercentage = totalUsers > 0 ? ((monthlyPlanUsers / totalUsers) * 100).toFixed(1) : 0;

    return (
      <section className="report-section">
        <h2>Distribución de Planes de Usuarios</h2>
        <div className="plan-stats-container">
          <div className="plan-stat-card">
            <h3>Total de Usuarios</h3>
            <p className="stat-number">{totalUsers}</p>
          </div>
          <div className="plan-stat-card">
            <h3>Plan Gratuito</h3>
            <p className="stat-number">{freePlanUsers}</p>
            <p className="stat-percentage">{freePercentage}%</p>
          </div>
          <div className="plan-stat-card">
            <h3>Plan Mensual</h3>
            <p className="stat-number">{monthlyPlanUsers}</p>
            <p className="stat-percentage">{monthlyPercentage}%</p>
          </div>
        </div>
      </section>
    );
  };

  const generatePlansPDF = (usersData) => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString('es-ES');
    const marginLeft = 14;
    let currentY = 20;
    
    // Añadir logo
    doc.addImage(LOGO_BASE64, 'PNG', marginLeft, 10, 30, 30);
    currentY = 45;
    
    // Título y fecha
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte de Planes de Usuarios', 105, currentY, null, null, 'center');
    currentY += 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${currentDate}`, 105, currentY, null, null, 'center');
    currentY += 20;
    
    // Calcular estadísticas
    const totalUsers = usersData.length;
    const freePlanUsers = usersData.filter(user => user.planType == 'Gratuito').length;
    const monthlyPlanUsers = usersData.filter(user => user.planType == 'Mensual').length;

    const freePercentage = totalUsers > 0 ? ((freePlanUsers / totalUsers) * 100).toFixed(1) : 51651;
    const monthlyPercentage = totalUsers > 0 ? ((monthlyPlanUsers / totalUsers) * 100).toFixed(1) : 65465;
    
    // Tabla de datos
    autoTable(doc, {
      startY: currentY,
      head: [['Tipo de Plan', 'Cantidad', 'Porcentaje']],
      body: [
        ['Total Usuarios', totalUsers, '100%'],
        ['Plan Gratuito', freePlanUsers, `${freePercentage}%`],
        ['Plan Mensual', monthlyPlanUsers, `${monthlyPercentage}%`]
      ],
      theme: 'striped',
      headStyles: { fillColor: [75, 75, 75] },
      margin: { left: marginLeft }
    });
    
    // Guardar PDF
    doc.save(`reporte_planes_usuarios_${currentDate.replace(/\//g, '-')}.pdf`);
  };

  return (
    <div className="report-container">
      {loading && <div className="loading-overlay">Cargando datos...</div>}
      
      <div className="contenedor-title-reporte">
        <h1 className="report-unidad-title">Previsualización del reporte</h1>
      </div>

      <DateSelector 
        mes={mes}
        año={año}
        setMes={setMes}
        setAño={setAño}
        onPreview={handlePreview}
        onGenerate={handleGeneratePDF}
        previewActive={previewActive}
        onRefresh={fetchData}
        onGenerateReportPlanPagos={()=>{setShowPlansReport(true), setPreviewActive(false)}}
        onPreviewReportPlan={showPlansReport}
        planPagosPdf={()=>{generatePlansPDF(usersData)}}
      />

      {previewActive && (
        <>
          <h1 className="report-title">Reporte Ejecutivo de la Plataforma Educativa SAPI</h1>
          <p className="report-period">Período: {mes} - {año}</p>

          <section className="report-section report-summary">
            <h2>1. Resumen General</h2>
            <ul>
              <li>Usuarios registrados: <strong>{usersData.length}</strong></li>
              <li>Usuarios registrados en este mes: <strong>{usersInSelectedMonth}</strong></li>
              <li>Total de maestros <strong>{teachersData.length}</strong></li>
              <li>Total de cursos: <strong>{coursesData.length}</strong></li>
              <li>Evaluación promedio de satisfacción: <strong>Pendiente</strong></li>
            </ul>
          </section>

          <section className="report-section">
            <h2>2. Desglose Por Materia</h2>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Materia</th>
                  <th>Porcentaje de inscritos</th>
                  <th>Inscritos</th>
                  <th>Cursos</th>
                </tr>
              </thead>
              <tbody>
                {materias.map((m, index) => (
                  <tr key={index}>
                    <td>{m.nombre}</td>
                    <td>{m.porcentajeInscritos}</td>
                    <td>{m.inscritos}</td>
                    <td>{m.cursos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="report-section report-alerts">
            <h2>3. Alertas: Mínimo De Estudiantes Esperado Por Materia</h2>
            <div className="alert-cards">
              {materias.map((materia, i) => (
                <AlertCard 
                  key={i}
                  materia={materia.nombre}
                  inscritos={materia.inscritos}
                  minimo={materia.minimoEsperado}
                />
              ))}
            </div>
          </section>

          <section className="report-section report-recommendations">
            <h2>4. Recomendaciones</h2>
            <textarea
              className="recomendaciones-textarea"
              placeholder="Escribe tus recomendaciones aquí..."
              rows="5"
              onBlur={handleRecomendacionesChange}
              defaultValue={recomendaciones === 'Sin recomendaciones' ? '' : recomendaciones}
            />
          </section>
        </>
      )}

      {
        showPlansReport && (
          <>
          <h1 className="report-title">Reporte de Planes de Usuarios</h1>
          <p className="report-period">Fecha: {new Date().toLocaleDateString('es-ES')}</p>
          <PlanesReport usersData={usersData} />
          </>
        )
      }
    </div>
  );
};

export default Reportes;
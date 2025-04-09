import React, { useState, useEffect } from 'react';
import { db } from "../../config/app";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import "./styles/Reportes.css";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import jsPDF from 'jspdf';
import 'jspdf-autotable';

import CourseModel from '../../models/course_model';
import UnitModel from '../../models/unit_model';
import LessonModel from '../../models/lesson_model';

const Reportes = () => {
  const [loading, setLoading] = useState(false);

  const generarReporte = async () => {
    setLoading(true);
    try {
      const [coursesSnap, unitsSnap, lessonsSnap] = await Promise.all([
        getDocs(collection(db, 'courses')),
        getDocs(collection(db, 'units')),
        getDocs(collection(db, 'lessons'))
      ]);

      const cursos = coursesSnap.docs.map(doc => CourseModel.fromJson({ id: doc.id, ...doc.data() }));
      const unidades = unitsSnap.docs.map(doc => UnitModel.fromJson({ id: doc.id, ...doc.data() }));
      const lecciones = lessonsSnap.docs.map(doc => LessonModel.fromJson({ id: doc.id, ...doc.data() }));

      const cursosConEstructura = cursos.map(curso => {
        const unidadesDelCurso = unidades
          .filter(u => u.course_id === curso.id)
          .map(unidad => {
            const leccionesDeUnidad = lecciones.filter(l => l.unit_id === unidad.id);
            return { ...unidad, lecciones: leccionesDeUnidad };
          });
        return { ...curso, unidades: unidadesDelCurso };
      });

      const doc = new jsPDF();
      const fecha = new Date().toLocaleString();
      let y = 20;

      doc.setFontSize(18);
      doc.text('Reporte de Cursos', 14, y);
      y += 10;
      doc.setFontSize(12);
      doc.text(`Fecha de generación: ${fecha}`, 14, y);
      y += 10;

      cursosConEstructura.forEach((curso, idx) => {
        doc.setFontSize(14);
        doc.text(`${idx + 1}. ${curso.title} - ${curso.category}`, 14, y);
        y += 8;
        doc.setFontSize(11);
        doc.text(`Descripción: ${curso.description}`, 16, y);
        y += 6;
        doc.text(`Profesor: ${curso.teacher} | Fecha: ${curso.creation_date}`, 16, y);
        y += 6;

        if (curso.unidades.length === 0) {
          doc.text('No tiene unidades registradas.', 18, y);
          y += 8;
        }

        curso.unidades.forEach((unidad, i) => {
          doc.setFontSize(12);
          doc.text(`Unidad ${unidad.number_unit}: ${unidad.title}`, 18, y);
          y += 6;
          doc.setFontSize(10);
          doc.text(`Descripción: ${unidad.description}`, 20, y);
          y += 5;

          if (unidad.lecciones.length === 0) {
            doc.text('No tiene lecciones registradas.', 22, y);
            y += 6;
          } else {
            unidad.lecciones.forEach((leccion, j) => {
              doc.text(`Lección ${leccion.number_lesson}: ${leccion.title}`, 22, y);
              y += 5;
              doc.text(`📄 Doc: ${leccion.link_doc || 'N/A'} | 🎥 Video: ${leccion.link_video || 'N/A'}`, 24, y);
              y += 6;

              // Verifica si el contenido está llegando al final de la página
              if (y > 270) {
                doc.addPage();
                y = 20;
              }
            });
          }
          y += 4;
        });

        y += 8;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });

      // Para el PDF
      doc.save('reporte_anidado_cursos.pdf');
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      alert('Ocurrió un error al generar el reporte.');
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Reportes</h1>
      <button onClick={generarReporte} disabled={loading} style={{ padding: '10px 20px', fontSize: '16px' }}>
        {loading ? 'Generando...' : 'Generar Reporte de Cursos'}
      </button>
    </div>
  );
};

export default Reportes;


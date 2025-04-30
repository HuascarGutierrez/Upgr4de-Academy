import { useState, useEffect } from 'react';
import './styles/ModuloEjercicios.css'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

// Componente principal del módulo de ejercicios
export default function ModuloEjercicios({user}) {
  const location = useLocation();
  const navigate = useNavigate();
  const unitTitle = location.state?.unitTitle;
  const unitId = location.state?.unitId;
//nivel
//puntuacion

  const [seccionActual, setSeccionActual] = useState('menu');

  const [nivelActual, setNivelActual] = useState(1); //aqui cambiar por el nivel
  const [puntuacion, setPuntuacion] = useState(0); //aqui cambiar por la puntuacion
  const [progreso, setProgreso] = useState({
    ecuacionesLineales: 0,
    ecuacionesCuadraticas: 0,
    inecuaciones: 0,
    sistemasEcuaciones: 0
  }); //aqui la lista de progresos

  // Función para cambiar de sección
  const cambiarSeccion = (seccion) => {
    setSeccionActual(seccion);
  };

  return (
    <div className="app-container">
      {/* Cabecera */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">{unitTitle}</h1>
          <div className="header-controls">
            <div className="puntos-badge">
              Puntos: {puntuacion}
            </div>
            <button 
              onClick={() => navigate(-1)}
              className="menu-button"
            >
              Salir del Curso
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="app-main">
        {seccionActual === 'menu' && (
          <MenuPrincipal cambiarSeccion={cambiarSeccion} progreso={progreso} />
        )}
        
        {seccionActual === 'ecuaciones-lineales' && (
          <Ejercicio 
            nivel={nivelActual} 
            cambiarSeccion={cambiarSeccion}
            actualizarPuntuacion={(puntos) => setPuntuacion(prev => prev + puntos)}
            actualizarProgreso={(valor) => setProgreso(prev => ({...prev, ecuacionesLineales: valor}))}
          />
        )}
        
        {seccionActual === 'inecuaciones' && (
          <Ejercicio 
            nivel={nivelActual}
            cambiarSeccion={cambiarSeccion}
            actualizarPuntuacion={(puntos) => setPuntuacion(prev => prev + puntos)}
            actualizarProgreso={(valor) => setProgreso(prev => ({...prev, inecuaciones: valor}))}
          />
        )}
      </main>

    </div>
  );
}

// Componente del menú principal
function MenuPrincipal({ cambiarSeccion, progreso }) {
  const modulos = [
    {
      id: 'ecuaciones-lineales',
      titulo: 'Ecuaciones Lineales',
      descripcion: 'Resuelve ecuaciones de primer grado y aplica propiedades algebraicas.',
      progreso: progreso.ecuacionesLineales,
      icono: '➗'
    },
    {
      id: 'ecuaciones-cuadraticas',
      titulo: 'Ecuaciones Cuadráticas',
      descripcion: 'Trabaja con ecuaciones de segundo grado y factorización.',
      progreso: progreso.ecuacionesCuadraticas,
      icono: '✖️'
    },
    {
      id: 'inecuaciones',
      titulo: 'Inecuaciones',
      descripcion: 'Aprende a resolver y graficar desigualdades algebraicas.',
      progreso: progreso.inecuaciones,
      icono: '≤'
    },
    {
      id: 'sistemas-ecuaciones',
      titulo: 'Sistemas de Ecuaciones',
      descripcion: 'Resuelve problemas con múltiples ecuaciones e incógnitas.',
      progreso: progreso.sistemasEcuaciones,
      icono: '🔢'
    }
  ];

  return (
    <div className="menu-container">
      <h2 className="menu-title">Módulos de Ejercicios</h2>
      
      <div className="modulos-grid">
        {modulos.map(modulo => (
          <div 
            key={modulo.id}
            className="modulo-card"
            onClick={() => cambiarSeccion(modulo.id)}
          >
            <div className="modulo-content">
              <div className="modulo-header">
                <div className="modulo-icono">{modulo.icono}</div>
                <h3 className="modulo-titulo">{modulo.titulo}</h3>
              </div>
              <p className="modulo-descripcion">{modulo.descripcion}</p>
              
              <div className="barra-progreso-container">
                <div 
                  className="barra-progreso"
                  style={{ width: `${modulo.progreso}%` }}
                ></div>
              </div>
              <div className="progreso-texto">
                {modulo.progreso}% Completado
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Ejercicio({ nivel, cambiarSeccion, actualizarPuntuacion, actualizarProgreso }) {
  const [ejercicioActual, setEjercicioActual] = useState(0);
  const [respuestaUsuario, setRespuestaUsuario] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [estadoRespuesta, setEstadoRespuesta] = useState(null); // 'correcto', 'incorrecto', null
  const [mostrarHint, setMostrarHint] = useState(false);
  const [ejerciciosCompletados, setEjerciciosCompletados] = useState(0);
  
  const ejercicios = [
    {
      enunciado: "Resuelve la ecuación: 2x + 3 = 11",
      respuesta: "4",
      hint: "Despeja primero el término con x, restando 3 en ambos miembros."
    },
    {
      enunciado: "Resuelve la ecuación: 5x - 7 = 3x + 9",
      respuesta: "8",
      hint: "Agrupa los términos con x en un lado y los números en el otro."
    },
    {
      enunciado: "Resuelve para x: 3(x - 2) = 15",
      respuesta: "7",
      hint: "Primero aplica la propiedad distributiva: 3x - 6 = 15"
    },
    {
      enunciado: "Si 4x + 2 = 2(x + 7), ¿cuál es el valor de x?",
      respuesta: "6",
      hint: "Desarrolla el lado derecho aplicando la propiedad distributiva."
    },
    {
      enunciado: "Resuelve la ecuación: x/3 + 2 = 8",
      respuesta: "18",
      hint: "Despeja primero el término con x, restando 2 en ambos miembros."
    }
  ];

  const verificarRespuesta = () => {
    setMostrarHint(false);
    if (respuestaUsuario === ejercicios[ejercicioActual].respuesta) {
      setMensaje("¡Correcto! Muy bien.");
      setEstadoRespuesta('correcto');
      actualizarPuntuacion(10);
      
      // Esperar un momento y avanzar al siguiente ejercicio
      setTimeout(() => {
        if (ejercicioActual < ejercicios.length - 1) {
          setEjercicioActual(ejercicioActual + 1);
          setEjerciciosCompletados(prev => prev + 1);
          setRespuestaUsuario('');
          setMensaje('');
          setEstadoRespuesta(null);
          
          // Actualizar el porcentaje de progreso
          const nuevoProgreso = Math.round((ejerciciosCompletados + 1) / ejercicios.length * 100);
          actualizarProgreso(nuevoProgreso);
        } else {
          setMensaje("¡Has completado todos los ejercicios de este nivel!");
          actualizarProgreso(100);
        }
      }, 1500);
    } else {
      setMensaje("Respuesta incorrecta. Intenta de nuevo.");
      setEstadoRespuesta('incorrecto');
    }
  };

  const mostrarAyuda = () => {
    setMostrarHint(true);
  };

  return (
    <div className="ejercicios-container ecuaciones-lineales">
      <div className="ejercicios-header">
        <h2 className="ejercicios-titulo">Ecuaciones Lineales</h2>
        <div className="ejercicios-contador">Ejercicio {ejercicioActual + 1} de {ejercicios.length}</div>
      </div>
      
      <div className="enunciado-container">
        <p className="enunciado-texto">{ejercicios[ejercicioActual].enunciado}</p>
      </div>
      
      <div className="respuesta-container">
        <label className="respuesta-label">Tu respuesta:</label>
        <div className="respuesta-input-container">
          <input
            type="text"
            value={respuestaUsuario}
            onChange={(e) => setRespuestaUsuario(e.target.value)}
            className="respuesta-input"
            placeholder="Ingresa tu respuesta"
          />
          <button
            onClick={verificarRespuesta}
            className="verificar-button"
          >
            Verificar
          </button>
        </div>
      </div>
      
      {mensaje && (
        <div 
          className={`mensaje-container ${
            estadoRespuesta === 'correcto' ? 'mensaje-correcto' : 'mensaje-incorrecto'
          }`}
        >
          {mensaje}
        </div>
      )}
      
      {estadoRespuesta === 'incorrecto' && (
        <div className="hint-container">
          <button
            onClick={mostrarAyuda}
            className="hint-button"
          >
            ¿Necesitas una pista?
          </button>
          
          {mostrarHint && (
            <div className="hint-text">
              <strong>Pista:</strong> {ejercicios[ejercicioActual].hint}
            </div>
          )}
        </div>
      )}
      
      <div className="ejercicios-footer">
        <button
          onClick={() => cambiarSeccion('menu')}
          className="volver-button"
        >
          Volver al menú
        </button>
        
        <div className="progreso-container">
          <span className="progreso-label">Progreso:</span>
          <div className="barra-progreso-pequeña-container">
            <div 
              className="barra-progreso-pequeña"
              style={{ width: `${Math.round(ejerciciosCompletados / ejercicios.length * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para ejercicios de inecuaciones
function EjerciciosInecuaciones({ nivel, cambiarSeccion, actualizarPuntuacion, actualizarProgreso }) {
  const [ejercicioActual, setEjercicioActual] = useState(0);
  const [respuestaUsuario, setRespuestaUsuario] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [estadoRespuesta, setEstadoRespuesta] = useState(null); // 'correcto', 'incorrecto', null
  const [mostrarHint, setMostrarHint] = useState(false);
  const [ejerciciosCompletados, setEjerciciosCompletados] = useState(0);
  
  const ejercicios = [
    {
      enunciado: "Resuelve la inecuación: 2x - 5 > 7",
      respuesta: "x > 6",
      hint: "Despeja x, sumando 5 y dividiendo por 2 en ambos lados."
    },
    {
      enunciado: "Resuelve la inecuación: 3x + 2 ≤ x - 6",
      respuesta: "x ≤ -4",
      hint: "Agrupa los términos con x en un lado y los números en el otro."
    },
    {
      enunciado: "Resuelve para x: -2x + 3 < -5",
      respuesta: "x > 4",
      hint: "Resta 3 en ambos lados y luego divide por -2 (recuerda invertir el signo)."
    },
    {
      enunciado: "Resuelve la inecuación: 5 - 3x ≥ 11",
      respuesta: "x ≤ -2",
      hint: "Resta 5 en ambos lados y divide por -3 (recuerda invertir el signo)."
    },
    {
      enunciado: "Si 4(x - 1) ≤ 2x + 6, ¿cuál es el valor de x?",
      respuesta: "x ≤ 5",
      hint: "Aplica la propiedad distributiva primero: 4x - 4 ≤ 2x + 6"
    }
  ];

  const verificarRespuesta = () => {
    setMostrarHint(false);
    const respuestaLimpia = respuestaUsuario.toLowerCase().replace(/\s+/g, '');
    const respuestaCorrecta = ejercicios[ejercicioActual].respuesta.toLowerCase().replace(/\s+/g, '');
    
    if (respuestaLimpia === respuestaCorrecta) {
      setMensaje("¡Correcto! Muy bien.");
      setEstadoRespuesta('correcto');
      actualizarPuntuacion(10);
      
      // Esperar un momento y avanzar al siguiente ejercicio
      setTimeout(() => {
        if (ejercicioActual < ejercicios.length - 1) {
          setEjercicioActual(ejercicioActual + 1);
          setEjerciciosCompletados(prev => prev + 1);
          setRespuestaUsuario('');
          setMensaje('');
          setEstadoRespuesta(null);
          
          // Actualizar el porcentaje de progreso
          const nuevoProgreso = Math.round((ejerciciosCompletados + 1) / ejercicios.length * 100);
          actualizarProgreso(nuevoProgreso);
        } else {
          setMensaje("¡Has completado todos los ejercicios de este nivel!");
          actualizarProgreso(100);
        }
      }, 1500);
    } else {
      setMensaje("Respuesta incorrecta. Intenta de nuevo.");
      setEstadoRespuesta('incorrecto');
    }
  };

  const mostrarAyuda = () => {
    setMostrarHint(true);
  };

  return (
    <div className="ejercicios-container inecuaciones">
      <div className="ejercicios-header">
        <h2 className="ejercicios-titulo">Inecuaciones</h2>
        <div className="ejercicios-contador">Ejercicio {ejercicioActual + 1} de {ejercicios.length}</div>
      </div>
      
      <div className="enunciado-container">
        <p className="enunciado-texto">{ejercicios[ejercicioActual].enunciado}</p>
      </div>
      
      <div className="respuesta-container">
        <label className="respuesta-label">Tu respuesta:</label>
        <div className="respuesta-input-container">
          <input
            type="text"
            value={respuestaUsuario}
            onChange={(e) => setRespuestaUsuario(e.target.value)}
            className="respuesta-input"
            placeholder="Escribe tu respuesta (ej: x > 5)"
          />
          <button
            onClick={verificarRespuesta}
            className="verificar-button verificar-inecuaciones"
          >
            Verificar
          </button>
        </div>
      </div>
      
      {mensaje && (
        <div 
          className={`mensaje-container ${
            estadoRespuesta === 'correcto' ? 'mensaje-correcto' : 'mensaje-incorrecto'
          }`}
        >
          {mensaje}
        </div>
      )}
      
      {estadoRespuesta === 'incorrecto' && (
        <div className="hint-container">
          <button
            onClick={mostrarAyuda}
            className="hint-button"
          >
            ¿Necesitas una pista?
          </button>
          
          {mostrarHint && (
            <div className="hint-text">
              <strong>Pista:</strong> {ejercicios[ejercicioActual].hint}
            </div>
          )}
        </div>
      )}
      
      <div className="ejercicios-footer">
        <button
          onClick={() => cambiarSeccion('menu')}
          className="volver-button"
        >
          Volver al menú
        </button>
        
        <div className="progreso-container">
          <span className="progreso-label">Progreso:</span>
          <div className="barra-progreso-pequeña-container">
            <div 
              className="barra-progreso-pequeña"
              style={{ width: `${Math.round(ejerciciosCompletados / ejercicios.length * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
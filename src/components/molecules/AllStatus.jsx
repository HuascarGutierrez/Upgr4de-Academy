import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInAnonymously,
    signInWithCustomToken,
    onAuthStateChanged,
} from "firebase/auth";
import {
    getFirestore,
    doc,
    onSnapshot,
    collection,
    getDocs,
} from "firebase/firestore";
import "./styles/AllStatus.css"

// Variables globales proporcionadas por el entorno de Canvas
// Asegúrate de que estas variables estén disponibles en tu entorno de ejecución.
const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";
const firebaseConfig =
    typeof __firebase_config !== "undefined" ? JSON.parse(__firebase_config) : {};
const initialAuthToken =
    typeof __initial_auth_token !== "undefined" ? __initial_auth_token : null;

function AllStatus() {
    // Estados para almacenar la instancia de la base de datos, autenticación y el ID del usuario
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false); // Para saber cuándo la autenticación está lista

    // Estados para los datos del usuario
    const [coursesCompleted, setCoursesCompleted] = useState(0);
    const [totalCourses, setTotalCourses] = useState(0);
    const [unitsCompleted, setUnitsCompleted] = useState(0);
    const [totalUnits, setTotalUnits] = useState(0);
    const [totalExercisesGlobal, setTotalExercisesGlobal] = useState(0); // Total de ejercicios en la BD
    const [isLoading, setIsLoading] = useState(true); // Estado de carga

    // Efecto para inicializar Firebase y manejar la autenticación
    useEffect(() => {
        try {
            const app = initializeApp(firebaseConfig);
            const firestoreDb = getFirestore(app);
            const firebaseAuth = getAuth(app);

            setDb(firestoreDb);
            setAuth(firebaseAuth);

            // Escuchar cambios en el estado de autenticación
            const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
                if (user) {
                    // Usuario autenticado
                    setUserId(user.uid);
                } else {
                    // Si no hay usuario, intentar iniciar sesión con el token personalizado o anónimamente
                    try {
                        if (initialAuthToken) {
                            await signInWithCustomToken(firebaseAuth, initialAuthToken);
                        } else {
                            await signInAnonymously(firebaseAuth);
                        }
                        // Después de iniciar sesión, onAuthStateChanged se disparará de nuevo con el usuario
                    } catch (error) {
                        console.error("Error al iniciar sesión:", error);
                        // Si falla la autenticación, aún podemos establecer un userId temporal para el path de la colección
                        setUserId(crypto.randomUUID());
                    }
                }
                setIsAuthReady(true); // La autenticación ha sido procesada
                setIsLoading(false); // La carga inicial de autenticación ha terminado
            });

            // Limpiar el listener al desmontar el componente
            return () => unsubscribe();
        } catch (error) {
            console.error("Error al inicializar Firebase:", error);
            setIsLoading(false);
        }
    }, []); // Se ejecuta solo una vez al montar el componente

    // Efecto para cargar los datos del usuario una vez que la autenticación está lista y el userId disponible
    useEffect(() => {
        if (!db || !auth || !isAuthReady || !userId) {
            // Esperar hasta que Firebase esté inicializado, autenticación lista y userId disponible
            return;
        }

        // Ruta a la colección de usuarios (ajusta si tu estructura es diferente)
        // Usamos el userId para acceder a los datos privados del usuario
        const userDocRef = doc(
            db,
            `artifacts/${appId}/users/${userId}/users`,
            userId
        );
        const enrolledCoursesCollectionRef = collection(
            userDocRef,
            "enrolledCourses"
        );

        // Escuchar cambios en los cursos inscritos del usuario en tiempo real
        const unsubscribeEnrolledCourses = onSnapshot(
            enrolledCoursesCollectionRef,
            (snapshot) => {
                let completedCoursesCount = 0;
                let totalCoursesCount = 0;
                let completedUnitsCount = 0;
                let totalUnitsCount = 0;

                snapshot.forEach((doc) => {
                    const courseData = doc.data();
                    totalCoursesCount++;
                    if (courseData.activo) {
                        // Asumiendo que 'activo: true' significa curso completado
                        completedCoursesCount++;
                    }

                    // Recorrer las unidades dentro de cada curso inscrito
                    if (courseData.units && Array.isArray(courseData.units)) {
                        courseData.units.forEach((unit) => {
                            totalUnitsCount++;
                            if (unit.completed) {
                                completedUnitsCount++;
                            }
                        });
                    }
                });

                setCoursesCompleted(completedCoursesCount);
                setTotalCourses(totalCoursesCount);
                setUnitsCompleted(completedUnitsCount);
                setTotalUnits(totalUnitsCount);
                setIsLoading(false); // Los datos del usuario han sido cargados
            },
            (error) => {
                console.error("Error al obtener los cursos inscritos:", error);
                setIsLoading(false);
            }
        );

        // Obtener el total global de ejercicios (no es por usuario, sino el total disponible en la BD)
        const fetchTotalExercises = async () => {
            try {
                const exercisesCollectionRef = collection(db, "exercises");
                const querySnapshot = await getDocs(exercisesCollectionRef);
                setTotalExercisesGlobal(querySnapshot.size);
            } catch (error) {
                console.error("Error al obtener el total de ejercicios:", error);
            }
        };

        fetchTotalExercises();

        // Limpiar los listeners al desmontar el componente
        return () => {
            unsubscribeEnrolledCourses();
        };
    }, [db, auth, userId, isAuthReady]); // Dependencias: se ejecuta cuando estas cambian

    if (isLoading) {
        return (
            <div className="AllStatus">
                <h2>Cargando estado...</h2>
                <p>Por favor, espera mientras cargamos tus datos.</p>
                {userId && <p>ID de usuario: {userId}</p>} {/* Mostrar ID de usuario */}
            </div>
        );
    }

    return (
        <>
            <div className="AllStatus">
                <h2>Estado Actual</h2>
                {userId && (
                    <p className="user-id-display">ID de usuario: {userId}</p>
                )}{" "}
                {/* Mostrar ID de usuario */}
                <div className="StatusP">
                    <div>
                        <img src="/assets/Icons-drawer_2.svg" alt="Ícono de cursos" />
                        <h3>
                            {coursesCompleted}/{totalCourses} cursos
                        </h3>
                    </div>
                    <div>
                        <img src="/assets/app_registration.svg" alt="Ícono de ejercicios" />
                        {/* Aquí se muestra el total de unidades completadas / total de unidades.
                Si necesitas ejercicios completados por el usuario, tu base de datos
                necesitaría un campo específico para ello. */}
                        <h3>
                            {unitsCompleted}/{totalUnits} Unidades completadas
                        </h3>
                    </div>
                    <div>
                        <img
                            src="/assets/stadia_controller.svg"
                            alt="Ícono de prototipos"
                        />
                        {/* Estos datos no están en tu estructura actual, se mantienen como placeholders */}
                        <h3>2 prototipos</h3>
                    </div>
                    <div>
                        <img
                            src="/assets/timelapse.svg"
                            alt="Ícono de tiempo de aprendizaje"
                        />
                        {/* Estos datos no están en tu estructura actual, se mantienen como placeholders */}
                        <h3>2 hrs de aprendizaje</h3>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AllStatus;

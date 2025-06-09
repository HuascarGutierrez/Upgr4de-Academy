import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./app";
import { handleAlert, handleErrorNoti, handleSuccess } from "./alerts"; // Asumo que estas son tus funciones de notificación personalizadas
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import { storage } from "./app2";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // <--- ¡LÍNEA AÑADIDA/CORREGIDA AQUÍ!
import Swal from 'sweetalert2'; // Asegúrate de que SweetAlert2 esté importado si usas Swal.fire directamente

const handleSignup = async ({ fullName, imageUrl, email, password, passwordVer, funcion }) => {
    try {
        if (password != passwordVer) {
            Swal.fire({ // Usando Swal.fire directamente como en tu código original
                title: "Error",
                text: "Su contraseña debe ser idéntica",
                icon: "error"
            });
            return
        }
        const userCRedential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(auth.currentUser);
        console.log(userCRedential.user.uid)
        const db = getFirestore(); // Obtener la instancia de Firestore

        const userRef = doc(db, "users", userCRedential.user.uid);
        getDoc(userRef).then((docSnap) => {
            console.log(docSnap)
            if (!docSnap.exists()) {
                setDoc(doc(db, "users", userCRedential.user.uid), {
                    uid: userCRedential.user.uid,
                    userName: fullName,
                    email: email,
                    imageUrl: imageUrl,
                    planType: 'Gratuito',
                    activo: true,
                    createdAt: new Date(), // Guarda la fecha de creación
                    Rol: 'Estudiante',
                    // ¡CAMPOS DE GAMIFICACIÓN AÑADIDOS AQUÍ!
                    points: 0,
                    achievements: {},
                    badges: [],
                    avatarParts: {
                        // ¡IMPORTANTE! Reemplaza estos con los IDs reales de tus items de avatar por defecto
                        body: 'default_body_id',
                        head: 'default_head_id'
                    }
                });
            } else {
                Swal.fire({
                    title: "Oopss...",
                    text: "Usuario ya registrado",
                    icon: "info"
                });
            }
        })

        handleSuccess({
            title: 'Verifica tu correo',
            texto: 'Tu usuario ha sido creado, verifica el SPAM de tu correo para verificar.'
        });

        funcion();
    } catch (error) {
        handleErrorNoti({ texto: `error en el registro: ${error.message}` })
    }
}

const handleLogin = async ({ email, password, funcion }) => {
    console.log(email)
    try {
        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                if (userCredential.user.emailVerified) {
                    handleSuccess({ texto: "Inicio de sesión exitoso." })
                    funcion();
                } else {
                    signOut(auth)
                    handleErrorNoti({ texto: 'Error al iniciar sesión', title: 'Error', color: '#ccccff' })
                }
            })

    } catch (error) {
        handleErrorNoti({ texto: `error en el registro: ${error.message}` })
    }
}

const handleAuth = async ({ funcion, salida }) => {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            const db = getFirestore(); // Obtener la instancia de Firestore
            const userRef = doc(db, "users", user.uid);
            getDoc(userRef).then((docSnap) => {
                if (!docSnap.exists()) {
                    setDoc(doc(db, "users", user.uid), {
                        uid: user.uid,
                        userName: user.displayName,
                        email: user.email,
                        imageUrl: user.photoURL,
                        planType: 'Gratuito',
                        activo: true,
                        createdAt: new Date(), // Guarda la fecha de creación
                        Rol: 'Estudiante',
                        // ¡CAMPOS DE GAMIFICACIÓN AÑADIDOS AQUÍ!
                        points: 0,
                        achievements: {},
                        badges: [],
                        avatarParts: {
                            // ¡IMPORTANT! Reemplaza estos con los IDs reales de tus items de avatar por defecto
                            body: 'default_body_id',
                            head: 'default_head_id'
                        }
                    }).then(() => {
                        handleSuccess({ texto: "Inicio de sesión exitoso." });
                        salida();
                        location.reload();
                    })
                } else {
                    console.log('usuario ya registrado')
                    funcion();
                    handleSuccess({ texto: "Inicio de sesión exitoso." });
                }
            })

        }).catch((error) => {
            handleErrorNoti({ texto: `error en el registro: ${error.message}` })
        });
}

const db = getFirestore(); // Obtener la instancia de Firestore

const getUserData = async (uid) => {
    if (!auth.currentUser) return null; // Verificamos si hay un usuario autenticado

    const userRef = doc(db, "users", uid); // Referencia al documento con el uid
    await getDoc(userRef).then((userSnap) => {
        if (userSnap.exists()) {
            console.log("Usuario encontrado");
            const userData = userSnap.data()
            return JSON.stringify(userData); // Retorna los datos del usuario
        } else {
            console.log("No se encontró el usuario");
            return null;
        }
    })
};

const handleUpdateImage = async ({ email, image }) => {
    const storageRef = ref(storage, `images_profiles/${email}`); // Carpeta 'images/' en Storage
    try {
        await uploadBytes(storageRef, image);
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (error) {
        console.error("Error al subir la imagen:", error);
        throw error; // Propagar el error para que Perfil.jsx pueda manejarlo con alertWarning
    }
};

export { handleSignup, handleLogin, handleAuth, getUserData, handleUpdateImage }
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./app";
import { handleAlert, handleErrorNoti, handleSuccess } from "./alerts";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";

const handleSignup = async({fullName, imageUrl, email, password, passwordVer,funcion}) => {
    try{
        if (password != passwordVer){
            handleAlert('Su contraseña debe ser idéntica');
            return
        }
        const userCRedential = await createUserWithEmailAndPassword(auth, email, password);
        //await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(auth.currentUser);
        console.log(userCRedential.user.uid)
        const db = getFirestore();
            const userRef = doc(db, "users", userCRedential.user.uid);
            getDoc(userRef).then((docSnap) => {
                console.log(docSnap)
                if (!docSnap.exists()){
                    setDoc(doc(db, "users", userCRedential.user.uid), {
                        uid: userCRedential.user.uid,
                        userName: fullName,
                        email: email,
                        imageUrl: imageUrl,
                        planType: 'free',
                        activo: true,
                        createdAt: new Date(), // Guarda la fecha de creación
                      });
                } else {
                    console.log('usuario ya registrado')
            }})

        //console.log('Usuario registrado: ',userCRedential.user);
        handleSuccess({title: 'Verifica tu correo',
            texto: 'Tu usuario ha sido creado, verifica el SPAM de tu correo para verificar.'});

        funcion();
    } catch(error){
        handleErrorNoti({texto: `error en el registro: ${error.message}`})
    }
}

const handleLogin = async({email, password, funcion}) => {
    console.log(email)
    try{
        await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            if(userCredential.user.emailVerified){
                handleSuccess({texto: "Inicio de sesión exitoso."})
                funcion();
            } else {
                signOut(auth)
                handleErrorNoti({texto: 'Error al iniciar sesión', title: 'Error', color: '#ccccff'})
            }
        })
        
    } catch(error){
        handleErrorNoti({texto: `error en el registro: ${error.message}`})
    }
}

const handleAuth = async({funcion, salida}) => {
        const provider = new GoogleAuthProvider();
    
        await signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            //const credential = GoogleAuthProvider.credentialFromResult(result);
            //const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            //console.log(user)
            const db = getFirestore();
            const userRef = doc(db, "users", user.uid);
            getDoc(userRef).then((docSnap) => {
                //console.log(docSnap)
                if (!docSnap.exists()){
                    setDoc(doc(db, "users", user.uid), {
                        uid: user.uid,
                        userName: user.displayName,
                        email: user.email,
                        imageUrl: user.photoURL,
                        planType: 'free',
                        activo: true,
                        createdAt: new Date(), // Guarda la fecha de creación
                      }).then(()=>{
                            handleSuccess({texto: "Inicio de sesión exitoso."});
                            salida();
                            location.reload();
                        }
                      )
                } else {
                    console.log('usuario ya registrado')
                    funcion();
                    handleSuccess({texto: "Inicio de sesión exitoso."});
            }})

            /**if(user ) {
                funcion();
                handleSuccess({texto: "Inicio de sesión exitoso."})
            } */
            // IdP data available using getAdditionalUserInfo(result)
            // ...
        }).catch((error) => {
            handleErrorNoti({texto: `error en el registro: ${error.message}`})
            // Handle Errors here.
        //    const errorCode = error.code;
        //    const errorMessage = error.message;
            // The email of the user's account used.
        //    const email = error.customData.email;
            // The AuthCredential type that was used.
        //    const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    }

    const db = getFirestore();

    const getUserData = async (uid) => {
      if (!auth.currentUser) return null; // Verificamos si hay un usuario autenticado
    
      const userRef = doc(db, "users", uid); // Referencia al documento con el uid
        await getDoc(userRef).then((userSnap) => {
            if (userSnap.exists()) {
                console.log("Usuario encontrado");
                const userData =userSnap.data()
                return JSON.stringify(userData); // Retorna los datos del usuario
              } else {
                console.log("No se encontró el usuario");
                return null;
              }
        }
      )
    };

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
    
    const handleUpdateImage = async ({email, image}) => {
        
            const storage = getStorage();
            const storageRef = ref(storage, `images_profiles/${email}`); // Carpeta 'images/' en Storage
    
            try {
              await uploadBytes(storageRef, image);
              //alert("Imagen subida con éxito");
            const url = await getDownloadURL(storageRef);
            return url;
              //console.log(url)
            } catch (error) {
              console.error("Error al subir la imagen:", error);
              //alert("Error al subir la imagen");
            }
          };

export {handleSignup, handleLogin, handleAuth, getUserData, handleUpdateImage}
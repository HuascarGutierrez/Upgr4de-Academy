import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./app";
import { handleAlert, handleErrorNoti, handleSuccess } from "./alerts";

const handleSignup = async({email, password, passwordVer,funcion}) => {
    try{
        if (password != passwordVer){
            handleAlert('Su contraseña debe ser idéntica');
            return
        }
        //const userCRedential = await createUserWithEmailAndPassword(auth, email, password);
        await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(auth.currentUser);

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

const handleAuth = async({funcion}) => {
        const provider = new GoogleAuthProvider();
    
        await signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            //const credential = GoogleAuthProvider.credentialFromResult(result);
            //const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            //console.log(user)
            if(user) {
                funcion();
                handleSuccess({texto: "Inicio de sesión exitoso."})
            }
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

export {handleSignup, handleLogin, handleAuth}
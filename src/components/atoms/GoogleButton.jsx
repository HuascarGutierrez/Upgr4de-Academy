import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../config/app";
import './styles/GoogleButton.css'
import { useNavigate } from "react-router-dom";
import { handleSuccess, handleErrorNoti } from "../../config/alerts";

function GoogleButton() {
    const navigate = useNavigate();

    const handleAuth = () => {
        const provider = new GoogleAuthProvider();
    
        signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            //const credential = GoogleAuthProvider.credentialFromResult(result);
            //const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            //console.log(user)
            if(user) {
                navigate('/main');
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

    return (
        <button onClick={handleAuth} className="googleButton">
            <img src="assets/google-logo.svg" alt="google-icon"/>
            <p>Usar tu cuenta de Google</p>
        </button>
    )
    }

export default GoogleButton
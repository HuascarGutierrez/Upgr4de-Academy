import './styles/Signup.css'
import { useState, useRef } from "react"
import LeftArrow from '../components/atoms/LeftArrow.jsx';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import GoogleButton from '../components/atoms/GoogleButton.jsx';
import Nav from '../components/organisms/Nav.jsx';
import { handleSignup } from '../config/auth_functions';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function SignUp() {
    const [waiting, setWaiting] = useState(false);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    const navigate = useNavigate();

    const fullNameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const passwordVerREf = useRef(null);

    const handleSubmit = async(e) => {
        setWaiting(true)

        e.preventDefault();

        const fullName = fullNameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const passwordVer = passwordVerREf.current.value;
        handleUploadImage({email: email});

        await handleSignup({fullName: fullName, email: email, imageUrl: imageUrl, password: password, passwordVer: passwordVer,funcion: ()=>{navigate('/')}})

        setWaiting(false)
    }

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
          setImage(e.target.files[0]); // Guarda la imagen en el estado
        }
      };

    const handleUploadImage = async ({email}) => {
        if (!image) {
            const url = 'https://firebasestorage.googleapis.com/v0/b/sapi-5c389.firebasestorage.app/o/images_profiles%2Fdefault_img_profile.webp?alt=media&token=56d413c0-7595-4131-8a5d-2213d13c3cad'
            setImageUrl(url);
          return;
        }
    
        const storage = getStorage();
        const storageRef = ref(storage, `images_profiles/${email}`); // Carpeta 'images/' en Storage

        try {
          await uploadBytes(storageRef, image);
          //alert("Imagen subida con éxito");
        const url = await getDownloadURL(storageRef);
        setImageUrl(url);
          //console.log(url)
        } catch (error) {
          console.error("Error al subir la imagen:", error);
          //alert("Error al subir la imagen");
        }
      };

  return (
    <section className="signup">
        <Nav/>
        <div className="signup_container">
            <h2 className="signup_title">Crea Una Cuenta</h2>
            <form className="signup_form" onSubmit={handleSubmit}>
                    <label htmlFor="fullName"> Nombre completo
                        <input className="form_input" type="text" id="fullName" placeholder='Veliz Benavidez' ref={fullNameRef} required/>
                    </label>
                    <label htmlFor="email"> Correo Electrónico
                        <input className="form_input"  type="email" id="email" placeholder="tucorreo@email.com" ref={emailRef} required/>
                    </label>
                    <label htmlFor="password"> Contraseña
                        <input className="form_input" type="password" id="password" placeholder="Contraseña" ref={passwordRef} required/>
                    </label>
                    <label htmlFor="confirmPassword"> Confirmar contraseña
                        <input className="form_input" type="password" id="confirmPassword" placeholder="Repita su contraseña" ref={passwordVerREf} required/>
                    </label>
                    <label htmlFor="fileInput">
                        <input type="file" id="fileInput" accept="image/*" onChange={handleFileChange}/>
                    </label>
                    {
                        waiting ? <div style={{marginInline: 'auto'}}><ClipLoader color="var(--swans-down-400)" size={40}/></div> :
                        <button className="form_btn" type="submit">CREAR MI CUENTA</button>
                    }
            </form>
        </div>
        <div className='signup_message'>
                    <span className='message_overlay'></span>
                    <h3>"En algún lugar, algo increíble está esperando a ser conocido."</h3>
                    <p>- Carl Sagan</p>
                    <GoogleButton/>
        </div>
    </section>
  )
}

export default SignUp
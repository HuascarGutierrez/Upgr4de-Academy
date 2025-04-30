import "./styles/Signup.css";
import { useState, useRef } from "react";
import LeftArrow from "../components/atoms/LeftArrow.jsx";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import GoogleButton from "../components/atoms/GoogleButton.jsx";
import Nav from "../components/organisms/Nav.jsx";
import { handleSignup } from "../config/auth_functions";
import { FaCheckCircle } from "react-icons/fa";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function SignUp() {
  const [waiting, setWaiting] = useState(false);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const navigate = useNavigate();

  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordVerREf = useRef(null);

  const handleSubmit = async (e) => {
    
    setWaiting(true);

    e.preventDefault();

    const fullName = fullNameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const passwordVer = passwordVerREf.current.value;
    
    const uploadedUrl = await handleUploadImage({ email }); // ¡esperamos la URL

    console.log("imailL: ", emailRef.current.value);
    console.log("fullName: ", fullNameRef.current.value);

    await handleSignup({
      fullName: fullName,
      email: email,
      imageUrl: uploadedUrl,
      password: password,
      passwordVer: passwordVer,
      funcion: () => {
        navigate("/");
      },
    });
    setWaiting(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]); // Guarda la imagen en el estado
        setHasPhoto(true); 
    }
  };

  const cancelFile = (e) => {
    if (e.target.files[0]) {
      setImage(null);
      setHasPhoto(false); 
    }
  }

  const handleUploadImage = async ({ email }) => {
    if (!image) {
      return "https://firebasestorage.googleapis.com/v0/b/sapi-5c389.firebasestorage.app/o/images_profiles%2Fdefault_img_profile.webp?alt=media&token=56d413c0-7595-4131-8a5d-2213d13c3cad";
    }

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
      return null;
    }
  };

  return (
    <section className="signup">
        <Nav/>
        <div className="signup_container">
            <h2 className="signup_title">Crea Una Cuenta para SAPI</h2>
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
                    <label htmlFor="fileInput"> Ingresa una foto de perfil
                        {hasPhoto &&
                        <div style={{display: 'inline-block'}}><FaCheckCircle className="check-icon" />
                        <button className="cancelImageButton" type="button" onClick={cancelFile}>Quitar imagen</button></div>}
                        <input className='form_input' type="file" id="fileInput" accept="image/*" onChange={handleFileChange}/>
                    </label>
                    {
                        waiting ? <div style={{marginInline: 'auto'}}><ClipLoader color="var(--swans-down-400)" size={40}/></div> :
                        <button className="form_btn" type="submit">CREAR MI CUENTA</button>
                    }
                    <div className="googleButton_container">
                        <GoogleButton/>
                    </div>
            </form>
        </div>
      <div className="signup_message">
        <span className="message_overlay"></span>
        <h3>¡Bienvenido a la comunidad SAPI! <br /> ¡Hola, futuro crack de las ciencias! 😎</h3>
        <p>Te estás uniendo como estudiante a SAPI, la plataforma diseñada para ayudarte a dominar lo que antes parecía difícil. <br />
💡 ¡El primer paso para aprender más, comienza hoy!</p>
        <GoogleButton />
      </div>
    </section>
  );
}

export default SignUp;

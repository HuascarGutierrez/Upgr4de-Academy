import React, { useState, useRef } from "react"; 
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/app"
import "./styles/CreateUserA.css"
import Swal from "sweetalert2";
import { storage } from "../../config/app2";

function CrearUserA() {
  const [waiting, setWaiting] = useState(false);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageName, setImageName] = useState(null); // Estado para el nombre del archivo
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordVer, setShowPasswordVer] = useState(false);


  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const togglePasswordVerVisibility = () => setShowPasswordVer(prev => !prev);

  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordVerRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageName(e.target.files[0].name); // Guardamos el nombre del archivo
    }
  };

  const handleUploadImage = async (email) => {
    if (!image) {
      const defaultUrl =
        "https://firebasestorage.googleapis.com/v0/b/sapi-5c389.firebasestorage.app/o/images_profiles%2Fdefault_img_profile.webp?alt=media&token=56d413c0-7595-4131-8a5d-2213d13c3cad";
      return defaultUrl;
    }

    //const storage = getStorage();
    const storageRef = ref(storage, `images_profiles/${email}`);

    try {
      await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      return null;
    }
  };

  const handleCreateUser = async (fullName, email, password, passwordVer) => {
    if (password !== passwordVer) {
      //alert("Las contraseñas no coinciden");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Las contraseñas no coinciden"
      });
      return;
    }
  
    setWaiting(true);
    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid; // Obtener UID generado por Firebase
  
      // 2. Subir imagen a Firebase Storage usando el UID
      const uploadedImageUrl = await handleUploadImage(uid);
      const finalImageUrl = uploadedImageUrl || imageUrl;
  
      // 3. Guardar usuario en Firestore
      const db = getFirestore();
      const userRef = doc(db, "users", uid);
      const docSnap = await getDoc(userRef);

      //4. contraseñas



  
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          uid,
          userName: fullName,
          email,
          imageUrl: finalImageUrl, // Guardamos la URL de la imagen
          planType: "Gratuito",
          activo: true,
          createdAt: new Date(),
          Rol:"Estudiante",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Usuario ya registrado"
        });
      }
  
      //alert("Usuario creado exitosamente");
      Swal.fire({
        title: "Usuario creado exitosamente",
        icon: "success",
        draggable: true
      });
      navigate("/admin/usersSection");
    } catch (error) {
      //alert(`Error en el registro: ${error.message}`);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error en el registro: ${error.message}"
      });
    } finally {
      setWaiting(false);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullName = fullNameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const passwordVer = passwordVerRef.current.value;
    await handleCreateUser(fullName, email, password, passwordVer);
  };

  return (
    <>
    <div className="CreateUser">
    <div className="CreateUser_container">
      <div className="Header_CreateUser">
      <button type="button" className="btn-volver" onClick={() => navigate("/admin/usersSection")}>
        <img src="/assets/circle-arrow-left.svg" alt="Volver" />
      </button>
      <h2 className="CreateUser_title">Crear una cuenta</h2>
      </div>
      <div className="CreateUser_form_container">
        <form className="CreateUser_form" onSubmit={handleSubmit}>
          <label>
            <p>Nombre completo</p>
            <input type="text" className="CreateUser_input" ref={fullNameRef} placeholder="Tu Nombre" required />
          </label>
          <label>
            <p>Correo Electrónico</p>
            <input type="email" className="CreateUser_input" ref={emailRef} placeholder="tucorreo@email.com" required />
          </label>
          {/*contrase;as*/}
          <label className="password-field">
            <p>Contraseña</p>
            <div className="input-with-icon">
              <input
                type={showPassword ? "text" : "password"}
                className="CreateUser_input"
                ref={passwordRef}
                placeholder="Contraseña"
                required
              />
              <span onClick={togglePasswordVisibility} className="eye-icon">
                <img
                  src={showPassword ? "/Icons/eye-slash.svg" : "/Icons/eye.svg"}
                  alt="Ver contraseña"
                />
              </span>
            </div>
          </label>
          <label className="password-field">
            <p>Confirmar contraseña</p>
            <div className="input-with-icon">
              <input
                type={showPasswordVer ? "text" : "password"}
                className="CreateUser_input"
                ref={passwordVerRef}
                placeholder="Repita su contraseña"
                required
              />
              <span onClick={togglePasswordVerVisibility} className="eye-icon">
                <img
                  src={showPasswordVer ? "/Icons/eye-slash.svg" : "/Icons/eye.svg"}
                  alt="Ver contraseña"
                />
              </span>
            </div>
          </label>

          <label>
            <p>Foto de perfil</p>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
          {waiting ? <ClipLoader color="var(--swans-down-400)" size={40} /> : <button type="submit" className="form_btn">CREAR USUARIO</button>}
        </form>

        <div className="image-preview-container">
          {image && (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(image)}
                alt="Imagen de perfil"
                className="image-preview-img"
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
              <p>{imageName}</p> {/* Muestra el nombre del archivo */}
            </div>
          )}
          {!image && (
            <div className="image-preview">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/sapi-5c389.firebasestorage.app/o/images_profiles%2Fdefault_img_profile.webp?alt=media&token=56d413c0-7595-4131-8a5d-2213d13c3cad"
                alt="Imagen de perfil por defecto"
                className="image-preview-img"
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
              <p>Imagen no cargada</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
    </>
  );
}

export default CrearUserA;

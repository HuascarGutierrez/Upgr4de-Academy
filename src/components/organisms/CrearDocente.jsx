import React, { useState, useRef } from "react"; 
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./styles/CreateUserA.css";
import Swal from "sweetalert2";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { storage } from "../../config/app2";

function CrearDocente() {
  const [waiting, setWaiting] = useState(false);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState(null);
  const navigate = useNavigate();

  const fullNameRef = useRef(null);
  const emailRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageName(e.target.files[0].name);
    }
  };

  const handleUploadImage = async (docenteId) => {
    if (!image) {
      return "https://firebasestorage.googleapis.com/v0/b/sapi-5c389.firebasestorage.app/o/images_profiles%2Fdefault_img_profile.webp?alt=media&token=56d413c0-7595-4131-8a5d-2213d13c3cad";
    }

    //const storage = getStorage();
    const storageRef = ref(storage, `teacher_profiles/${docenteId}`);

    try {
      await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      return null;
    }
  };

  const handleCreateDocente = async (fullName, email) => {
    setWaiting(true);
  
    try {
      const db = getFirestore();
      const docentesCollection = collection(db, "teacher");
  
      // Creamos un documento vacío primero para obtener el ID
      const tempDocRef = await addDoc(docentesCollection, {});
      const docenteId = tempDocRef.id;
  
      const imageUrl = await handleUploadImage(docenteId);
  
      // Ahora actualizamos el documento con los datos completos
      await setDoc(tempDocRef, {
        teacherName: fullName,
        email,
        imageUrl,
        activo: true,
        createdAt: new Date(),
        Rol:'Docente',
      });
  
      Swal.fire({
        title: "Docente registrado exitosamente",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/admin/usersSection");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error al registrar docente: ${error.message}`,
      });
    } finally {
      setWaiting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullName = fullNameRef.current.value;
    const email = emailRef.current.value;
    handleCreateDocente(fullName, email);
  };

  return (
    <div className="CreateUser">
      <div className="CreateUser_container">
        <div className="Header_CreateUser">
          <button type="button" className="btn-volver" onClick={() => navigate("/admin/usersSection")}>
            <img src="/assets/circle-arrow-left.svg" alt="Volver" />
          </button>
          <h2 className="CreateUser_title">Registrar Docente</h2>
        </div>

        <div className="CreateUser_form_container">
          <form className="CreateUser_form" onSubmit={handleSubmit}>
            <label>
              <p>Nombre completo</p>
              <input type="text" className="CreateUser_input" ref={fullNameRef} required />
            </label>
            <label>
              <p>Correo Electrónico</p>
              <input type="email" className="CreateUser_input" ref={emailRef} required />
            </label>
            <label>
              <p>Foto de perfil</p>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </label>
            {waiting ? <ClipLoader color="var(--swans-down-400)" size={40} /> : <button type="submit" className="form_btn">REGISTRAR DOCENTE</button>}
          </form>

          <div className="image-preview-container">
            <div className="image-preview">
              <img
                src={image ? URL.createObjectURL(image) : "https://firebasestorage.googleapis.com/v0/b/sapi-5c389.firebasestorage.app/o/images_profiles%2Fdefault_img_profile.webp?alt=media&token=56d413c0-7595-4131-8a5d-2213d13c3cad"}
                alt="Imagen de perfil"
                className="image-preview-img"
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
              <p>{image ? imageName : "Imagen no cargada"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrearDocente;

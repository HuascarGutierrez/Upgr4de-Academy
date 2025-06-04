import React, { useState, useRef } from "react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth } from "../../config/app";
import { storage } from "../../config/app2";
import Swal from "sweetalert2";
import "./styles/CreateUserA.css";

function CrearUserA({user}) {
  const [waiting, setWaiting] = useState(false);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordVer, setShowPasswordVer] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Estudiante");

  const navigate = useNavigate();

  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordVerRef = useRef(null);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const togglePasswordVerVisibility = () => setShowPasswordVer(prev => !prev);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageName(e.target.files[0].name);
    }
  };

  const handleUploadImage = async (uidOrEmail) => {
    if (!image) {
      return "https://firebasestorage.googleapis.com/v0/b/sapi-5c389.firebasestorage.app/o/images_profiles%2Fdefault_img_profile.webp?alt=media&token=56d413c0-7595-4131-8a5d-2213d13c3cad";
    }

    const storageRef = ref(storage, `images_profiles/${uidOrEmail}`);
    try {
      await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      return null;
    }
  };

  const handleCreateUser = async (fullName, email, password, passwordVer, role) => {
    if (role !== "Docente" && password !== passwordVer) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Las contraseñas no coinciden"
      });
      return;
    }

    setWaiting(true);
    try {
      const db = getFirestore();
      let uid = email; // para docentes, se usará el email como identificador
      let finalImageUrl = "";

      if (role === "Docente") {
      const userRef = doc(db, "users", uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "El docente ya está registrado"
        });
        setWaiting(false);
        return;
      }

      finalImageUrl = await handleUploadImage(uid);

      await setDoc(userRef, {
        uid,
        userName: fullName,
        email,
        imageUrl: finalImageUrl,
        activo: true,
        createdAt: new Date(),
        Rol: role,
      });
    } else {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      uid = userCredential.user.uid;
      finalImageUrl = await handleUploadImage(uid);

      const userRef = doc(db, "users", uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Usuario ya registrado"
        });
        setWaiting(false);
        return;
      }

      const userData = {
        uid,
        userName: fullName,
        email,
        imageUrl: finalImageUrl,
        activo: true,
        createdAt: new Date(),
        Rol: role,
      };

      if (role === "Estudiante") {
        userData.planType = "Gratuito";
      }

      await setDoc(userRef, userData);
    }


      Swal.fire({
        title: "Usuario creado exitosamente",
        icon: "success",
      });
      navigate("/admin/usersSection");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Error en el registro: ${error.message}`
      });
    } finally {
      setWaiting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullName = fullNameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current?.value || "";
    const passwordVer = passwordVerRef.current?.value || "";
    await handleCreateUser(fullName, email, password, passwordVer, selectedRole);
  };

  return (
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
              <p>Rol del Usuario</p>
              <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="CreateUser_input" required>
                <option value="Estudiante">Estudiante</option>
                <option value="Docente">Docente</option>
                <option value="Administrador">Administrador</option>
              </select>
            </label>
            <label>
              <p>Nombre completo</p>
              <input type="text" className="CreateUser_input" ref={fullNameRef} placeholder="Tu Nombre" required />
            </label>
            <label>
              <p>Correo Electrónico</p>
              <input type="email" className="CreateUser_input" ref={emailRef} placeholder="tucorreo@email.com" required />
            </label>

            {selectedRole !== "Docente" && (
              <>
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
                      <img src={showPassword ? "/Icons/eye-slash.svg" : "/Icons/eye.svg"} alt="Ver contraseña" />
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
                      <img src={showPasswordVer ? "/Icons/eye-slash.svg" : "/Icons/eye.svg"} alt="Ver contraseña" />
                    </span>
                  </div>
                </label>
              </>
            )}

            <label>
              <p>Foto de perfil</p>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </label>

            {waiting ? (
              <ClipLoader color="var(--swans-down-400)" size={40} />
            ) : (
              <button type="submit" className="form_btn">CREAR USUARIO</button>
            )}
          </form>

          <div className="image-preview-container">
            <div className="image-preview">
              <img
                src={
                  image
                    ? URL.createObjectURL(image)
                    : "https://firebasestorage.googleapis.com/v0/b/sapi-5c389.firebasestorage.app/o/images_profiles%2Fdefault_img_profile.webp?alt=media&token=56d413c0-7595-4131-8a5d-2213d13c3cad"
                }
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

export default CrearUserA;

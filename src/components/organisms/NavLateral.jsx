import React from "react";
import "./styles/NavLateral.css";
import { useNavigate } from "react-router-dom";

function NavLateral() {
  const navigate = useNavigate();
  return (
    <div className="navLateral">
      <div
        onClick={() => {
          navigate("/");
        }}
        className="navLateral_logo"
      >
        <img src="/assets/buho_verde.svg" alt="" />
        <h2>SAPI</h2>
      </div>
      <div className="navLateral_content">
        <ul className="navLateral_list">
          <li
            onClick={() => {
              navigate("/main/courses");
            }}
            className="navLateral_item"
          >
            <img src="/assets/navLateral_1.svg" alt="" />
            <p>Inicio</p>
          </li>
          <li
            onClick={() => {
              navigate("/main/catalogo");
            }}
            className="navLateral_item"
          >
            <img src="/assets/navLateral_2.svg" alt="" />
            <p>Catálogo</p>
          </li>
          <li
            onClick={() => {
              navigate("/main/supervision");
            }}
            className="navLateral_item"
          >
            <img src="/assets/navLateral_3.svg" alt="" />
            <p>Estadísticas</p>
          </li>
          <li
            onClick={() => {
              navigate("/main/perfil");
            }}
            className="navLateral_item"
          >
            <img src="/assets/navLateral_4.svg" alt="" />
            <p>Perfil</p>
          </li>
        </ul>
      </div>
      <div
        onClick={() => {
          navigate("/");
        }}
        className="navLateral_exit"
      >
        <svg
          width="40px"
          height="40px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              opacity="0.5"
              d="M9.052 4.5C9 5.07763 9 5.80355 9 6.72183V17.2781C9 18.1964 9 18.9224 9.05201 19.5H8C5.64298 19.5 4.46447 19.5 3.73223 18.7678C3 18.0355 3 16.857 3 14.5V9.5C3 7.14298 3 5.96447 3.73223 5.23223C4.46447 4.5 5.64298 4.5 8 4.5H9.052Z"
              fill="white"
            ></path>{" "}
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.70725 2.4087C9 3.03569 9 4.18259 9 6.4764V17.5236C9 19.8174 9 20.9643 9.70725 21.5913C10.4145 22.2183 11.4955 22.0297 13.6576 21.6526L15.9864 21.2465C18.3809 20.8288 19.5781 20.62 20.2891 19.7417C21 18.8635 21 17.5933 21 15.0529V8.94711C21 6.40671 21 5.13652 20.2891 4.25826C19.5781 3.37999 18.3809 3.17118 15.9864 2.75354L13.6576 2.34736C11.4955 1.97026 10.4145 1.78171 9.70725 2.4087ZM12.75 10.9535C12.75 10.52 12.4142 10.1686 12 10.1686C11.5858 10.1686 11.25 10.52 11.25 10.9535V13.0465C11.25 13.48 11.5858 13.8314 12 13.8314C12.4142 13.8314 12.75 13.48 12.75 13.0465V10.9535Z"
              fill="white"
            ></path>{" "}
          </g>
        </svg>
        <p>Salir</p>
      </div>
    </div>
  );
}

export default NavLateral;

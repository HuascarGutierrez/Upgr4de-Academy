import React, { useState, useEffect } from "react";
import "./styles/Calendario.css";

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function Calendario() {
  const [date, setDate] = useState(new Date());
  const currYear = date.getFullYear();
  const currMonth = date.getMonth();

  const renderCalendar = () => {
    const firstDayofMonth = new Date(currYear, currMonth, 1).getDay();
    const lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
    const lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay();
    const lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();

    let days = [];

    // Días del mes anterior
    for (let i = firstDayofMonth; i > 0; i--) {
      days.push(<li key={`prev-${i}`} className="inactive">{lastDateofLastMonth - i + 1}</li>);
    }

    // Días del mes actual
    for (let i = 1; i <= lastDateofMonth; i++) {
      const isToday = i === new Date().getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear();
      days.push(<li key={i} className={isToday ? "active" : ""}>{i}</li>);
    }

    // Días del próximo mes
    for (let i = lastDayofMonth; i < 6; i++) {
      days.push(<li key={`next-${i}`} className="inactive">{i - lastDayofMonth + 1}</li>);
    }

    return days;
  };

  const handlePrevNext = (direction) => {
    setDate((prevDate) => {
      const newMonth = direction === "prev" ? prevDate.getMonth() - 1 : prevDate.getMonth() + 1;
      return new Date(prevDate.getFullYear(), newMonth, 1);
    });
  };

  return (
    <div className="wrapper">
      <header>
        <p className="current-date">{`${months[currMonth]} ${currYear}`}</p>
        <div className="icons">
          <span id="prev" className="material-symbols-rounded" onClick={() => handlePrevNext("prev")}>
            <img src="/assets/chevron-left-svgrepo-com.svg" alt="" />
          </span>
          <span id="next" className="material-symbols-rounded" onClick={() => handlePrevNext("next")}>
            <img src="/assets/chevron-right-svgrepo-com.svg" alt="" />
          </span>
        </div>
      </header>
      <div className="calendar">
        <ul className="weeks">
          <li>Dom</li>
          <li>Lun</li>
          <li>Mar</li>
          <li>Mie</li>
          <li>Jue</li>
          <li>Vie</li>
          <li>Sab</li>
        </ul>
        <ul className="days">{renderCalendar()}</ul>
      </div>
    </div>
  );
}

export default Calendario;

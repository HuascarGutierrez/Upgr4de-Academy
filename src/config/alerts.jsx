import Swal from "sweetalert2"

export const handleAlert = (text) => {
        Swal.fire({
            title: 'Cuidado',
            text: text,
            icon: 'question',
            iconColor: 'var(--brandy-punch-500)',
            confirmButtonText: 'Opps, Oki',
            background: 'var(--black-50)',
            color: 'var(--brandy-punch-500)',
            confirmButtonColor: 'var(--brandy-punch-500)',
        })
    }

export const handleSuccess = ({title='Perfecto', texto}) => {
        Swal.fire({
            title: title,
            text: texto,
            icon: 'success',
            iconColor: 'var(--swans-down-500)',
            confirmButtonText: 'Continuar',
            background: 'var(--black-200)',
            color: 'var(--swans-down-500)',
            confirmButtonColor: 'var(--swans-down-500)',
        })
    }

export const handleErrorNoti = ({texto, color= '#ff0000', title= 'Error'}) => {
        Swal.fire({
            title: title,
            text: texto,
            icon: 'warning',
            iconColor: color,
            confirmButtonText: 'OK',
            background: 'var(--black-950)',
            color: color,
            confirmButtonColor: '#ff0000',
        })
    }

export    const alertSignOut = () => {
        Swal.fire({
          title: "Hasta pronto!",
          text: "No te olvides de seguir adelante.",
          icon: "info",
          iconColor: 'var(--brandy-punch-500)',
          confirmButtonText: "OK",
          background: "var(--black-100)", 
          color: "var(--black-900)",
          confirmButtonColor: "var(--brandy-punch-500)",
        });
      }

export const alertWarning = (texto) => {
    Swal.fire({
      title: 'Error',
      text: texto,
      icon: 'error',
      iconColor: '#ff0000',
      confirmButtonText: 'Entendido',
      background: 'var(--black-900)',
      color: '#ff0000',
      confirmButtonColor: '#ff0000',
    })
  }
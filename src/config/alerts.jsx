import Swal from "sweetalert2"

export const handleAlert = (text) => {
        Swal.fire({
            title: 'Cuidado',
            text: text,
            icon: 'question',
            iconColor: 'var(--color-orange-secondary)',
            confirmButtonText: 'Opps, Oki',
            background: 'var(--color-white)',
            color: 'var(--color-orange-secondary)',
            confirmButtonColor: 'var(--color-orange-secondary)',
        })
    }

export const handleSuccess = ({title='Perfecto', texto}) => {
        Swal.fire({
            title: title,
            text: texto,
            icon: 'success',
            iconColor: 'var(--color-green-primary)',
            confirmButtonText: 'Continuar',
            background: 'var(--color-gray-medium)',
            color: 'var(--color-green-primary)',
            confirmButtonColor: 'var(--color-green-primary)',
        })
    }

export const handleErrorNoti = ({texto, color= '#ff0000', title= 'Error'}) => {
        Swal.fire({
            title: title,
            text: texto,
            icon: 'warning',
            iconColor: color,
            confirmButtonText: 'OK',
            background: 'var(--color-blue)',
            color: color,
            confirmButtonColor: '#ff0000',
        })
    }
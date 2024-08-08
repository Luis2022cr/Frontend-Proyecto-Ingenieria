import axiosInstance from '../api/axiosInstance';

//Datos que se utilizaran de la peticion
export interface Solicitud {
  id: number;
  nombre_actividad: string;
  objetivos: string;
  descripcion: string;
  ubicacion: string;
  carrera: string;
  ambito: string;
  solicitante: string;
  horas_art140: number;
  cupos_disponibles: number;
  fecha: string;
  hora_inicio: string;
  hora_final: string;
  estado: string; //este se usara para el filtro nada mas, no se mostrara en la tabla
}

//Esta interfaz se usara para enviar los nuevos estados
export interface Estado {
  estado: number;
  observacion?:  string;
}

//Traer los datos necesarios de las actividades
export const fetchSolicitudes = async (): Promise<Solicitud[]> => {
  const response = await axiosInstance.get('/actividades');
  return response.data;
};

// Actualizar el estado de una actividad y sus observaciones
export const actualizarEstadoActividad = async (id: number, estado: Estado): Promise<string> => {
  try {
    const response = await axiosInstance.patch(`/actividades/${id}/estado`, estado);
    return response.data.message;
  } catch (error) {
    console.error('Error actualizando el estado de la actividad:', error);
    throw new Error('Error desconocido al actualizar el estado de la actividad.');
  }
};
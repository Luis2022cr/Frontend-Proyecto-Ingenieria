import axiosInstance from "../api/axiosInstance";

export interface Actividad {
  id: number;
  nombre_actividad: string;
  objetivos: string;
  actividades_principales: string;
  descripcion: string;
  ubicacion: string;
  carrera: string;
  ambito: string;
  coordinador: string;
  estudiante: string;
  horas_art140: number;
  cupos: number;
  cupos_disponibles: number;
  fecha: Date; 
  hora_inicio: string; 
  hora_final: string;
  fecha_entrega: Date; 
  estado: string;
  observaciones: string;
  informe: string | null;
}

// Interfaz para solicitud POST
export interface ActividadPost {
  nombre_actividad: string;
  objetivos: string;
  actividades_principales: string;
  descripcion: string;
  ubicacion: string;
  ambito_id: number;
  estudiante_id: number;
  horas_art140: number;
  cupos: number;
  fecha: string;
  hora_inicio: string;
  hora_final: string;
  observaciones?: string;
}

//Crear nuevo
export const createActividad = async (actividad: Omit<ActividadPost, 'id'>): Promise<ActividadPost> => {
const response = await axiosInstance.post('/actividades', actividad);
return response.data;
};

  
  //Lista de todas las actividades
  export const fetchActividades = async (): Promise<Actividad[]> => {
    const response = await axiosInstance.get<Actividad[]>('/actividades');

    return response.data;
  };


//editar
export const updateActividad = async (id: number, actividad: Omit<ActividadPost, 'id'>): Promise<ActividadPost> => {
  const response = await axiosInstance.put(`/actividades/${id}`, actividad);
  return response.data;
};

import axiosInstance from "../api/axiosInstance";

export interface Actividad {
    id: number;
    nombre_actividad: string;
    descripcion: string;
    ubicacion: string;
    carrera: string;
    ambito: string;
    horas_art140: string;
    cupos: string;
    fecha: string;
    hora_inicio: string;
    hora_final: string;
  }
  
  export const fetchActividades = async (): Promise<Actividad[]> => {
    const response = await axiosInstance.get<Actividad[]>('/gestion_alumno');
    return response.data;
  };
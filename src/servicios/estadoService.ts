import axiosInstance from "../api/axiosInstance";

export interface Estado {
    id: number;
    nombre_estado: string;
    descripcion: string;
  }
  
  export const fetchEstado = async (): Promise<Estado[]> => {
    const response = await axiosInstance.get<Estado[]>('/estados');
    return response.data;
  };
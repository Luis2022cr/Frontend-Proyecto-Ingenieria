import axiosInstance from "../api/axiosInstance";

export interface Ambito {
    id: number;
    nombre_ambito: string;
    descripcion: string;
  }
  
  export const fetchAmbitos = async (): Promise<Ambito[]> => {
    const response = await axiosInstance.get<Ambito[]>('/ambitos');
    return response.data;
  };
import axiosInstance from "../api/axiosInstance";

export interface Carrera {
  id: number;
  nombre_carrera: string;
  descripcion: string;
  facultad: string;
}

export const fetchCarreras = async (): Promise<Carrera[]> => {
  const response = await axiosInstance.get<Carrera[]>('/carreras');
  return response.data;
};

export const fetchCarreraPorId = async (id: number): Promise<Carrera | null> => {
  try {
    const response = await axiosInstance.get<Carrera>(`/carreras/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching carrera:', error);
    return null;
  }
};

export const createCarrera = async (carrera: Omit<Carrera, 'id'>): Promise<Carrera> => {
  const response = await axiosInstance.post('/carreras', carrera);
  return response.data;
};

export const updateCarrera = async (id: number, carrera: Omit<Carrera, 'id'>): Promise<Carrera> => {
  const response = await axiosInstance.put(`/carreras/${id}`, carrera);
  return response.data;
};

export const deleteCarrera = async (id: number): Promise<boolean> => {
    const response = await axiosInstance.delete<boolean>(`/carreras/${id}`);
    return response.data;
};

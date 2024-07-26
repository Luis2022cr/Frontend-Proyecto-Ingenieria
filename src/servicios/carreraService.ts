import axiosInstance from "../api/axiosInstance";

//Datos que se van a usar
export interface Carrera {
  id: number;
  nombre_carrera: string;
  descripcion: string;
  facultad: string;
}

//Traer todos los datos
export const fetchCarreras = async (): Promise<Carrera[]> => {
  const response = await axiosInstance.get<Carrera[]>('/carreras');
  return response.data;
};

//Traer los datos por Id
export const fetchCarreraPorId = async (id: number): Promise<Carrera | null> => {
  try {
    const response = await axiosInstance.get<Carrera>(`/carreras/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching carrera:', error);
    return null;
  }
};

//Crear nuevo
export const createCarrera = async (carrera: Omit<Carrera, 'id'>): Promise<Carrera> => {
  const response = await axiosInstance.post('/carreras', carrera);
  return response.data;
};

//Editar dato
export const updateCarrera = async (id: number, carrera: Omit<Carrera, 'id'>): Promise<Carrera> => {
  const response = await axiosInstance.put(`/carreras/${id}`, carrera);
  return response.data;
};


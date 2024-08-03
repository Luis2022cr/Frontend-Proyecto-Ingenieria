import axiosInstance from "../api/axiosInstance";

export interface ActividadUser {
  id: number;
  nombre_actividad: string;
  descripcion: string;
  ubicacion: string;
  carrera_id: number;
  ambito_id: number;
  horas_art140: string;
  cupos: string;
  fecha: string;
  hora_inicio: string;
  hora_final: string;
}

//Datos de los participantes de las actividades
export interface ActividadParticipantes {
  id: number;
  nombre: string;
  apellido: string;
  correo_institucional: string;
  actividades: ActividadUser[];
}

// Datos de los participantes de una actividad
export interface Participante {
  id: number;
  nombre: string;
  apellido: string;
  numero_usuario: number;
}

// Respuesta del endpoint de participantes
export interface ActividadConParticipantes {
  id: number;
  nombre_actividad: string;
  participantes: Participante[];
}

interface actividadParticipante {
  id_usuario: number;
  id_actividad: number;
}

//Actividades en las que esta un usuario
export const fetchActividadesAlumnoPorId = async (
  id: number
): Promise<ActividadParticipantes | null> => {
  try {
    const response = await axiosInstance.get<ActividadParticipantes>(
      `/usuarios/${id}/actividades`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching actividades del alumno:", error);
    return null;
  }
};

// Obtener lista de participantes de una actividad específica
export const fetchParticipantesPorActividadId = async (
  id_actividad: number
): Promise<ActividadConParticipantes | null> => {
  try {
    const response = await axiosInstance.get<ActividadConParticipantes>(
      `/actividades/${id_actividad}/participantes`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching participantes de la actividad:", error);
    return null;
  }
};

  //Usuario puede unirse a una actividad
  export const añadirParticipante = async (request: actividadParticipante): Promise<string> => {
    console.log('Enviando solicitud:', request); // Agregar este log
    try {
      const response = await axiosInstance.post('/participantes', request);
      console.log('Respuesta del servidor:', response.data); // Agregar este log
      return response.data; // Asume que la respuesta es un mensaje
    } catch (error) {
      console.error('Error añadiendo participante:', error);
      throw new Error('Error al añadir participante.');
    }
  };

  //Quitar a un usuario de una actividad
  export const quitarParticipante = async (request: actividadParticipante): Promise<string> => {
    console.log('Enviando solicitud:', request); // Agregar este log
    try {
      const response = await axiosInstance.put('/actividades-participantes', request);
      console.log('Respuesta del servidor:', response.data); // Agregar este log
      return response.data; // Asume que la respuesta es un mensaje
    } catch (error) {
      console.error('Error eliminando participante:', error);
      throw new Error('Error al eliminar participante.');
    }
  };
  

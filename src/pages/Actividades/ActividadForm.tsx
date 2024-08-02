import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActividadPost, createActividad } from '../../servicios/actividadService';
import { Ambito, fetchAmbitos } from '../../servicios/ambitoService';

const ActividadForm: React.FC = () => {
  const navigate = useNavigate();
  const [actividad, setActividad] = useState<ActividadPost>({
    nombre_actividad: '',
    objetivos: '',
    actividades_principales: '',
    descripcion: '',
    ubicacion: '',
    ambito_id: 0,
    estudiante_id: 0,
    horas_art140: 0,
    cupos: 0,
    fecha: '',
    hora_inicio: '',
    hora_final: '',
    observaciones: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const userId = localStorage.getItem('userId');
  const [ambitos, setAmbitos] = useState<Ambito[]>([]);

  useEffect(() => {
    if (userId) {
      setActividad(prevState => ({
        ...prevState,
        estudiante_id: Number(userId)
      }));
    }
  
    const obtenerAmbitos = async () => {
      try {
        const response = await fetchAmbitos();
        setAmbitos(response);
      } catch (err) {
        console.error('Error fetching ambitos:', err);
        setError('Error al obtener los ámbitos. Inténtalo de nuevo.');
      }
    };
  
    obtenerAmbitos();
  }, [userId]); 
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    // No permitir cambios en estudiante_id
    if (name === 'estudiante_id') return;
  
    setActividad(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createActividad(actividad);
      navigate('/gestion_alumno');
    } catch (error) {
      setError('Error creating actividad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="card-activiades bg-yellow-100 p-4">
        <h2 className="mb-4">Crear Actividad</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="nombre_actividad" className="form-label">Nombre de la Actividad</label>
              <input
                type="text"
                className="form-control"
                id="nombre_actividad"
                name="nombre_actividad"
                value={actividad.nombre_actividad}
                onChange={handleChange}
                required
              />
            </div>
           
            <div className="col-md-6 mb-3">
              <label htmlFor="ubicacion" className="form-label">Ubicación</label>
              <input
                type="text"
                className="form-control"
                id="ubicacion"
                name="ubicacion"
                value={actividad.ubicacion}
                onChange={handleChange}
                required
              />
            </div>
           
            <div className="col-md-6 mb-3">
              <label htmlFor="ambito_id" className="form-label">Ámbito</label>
              <select
                className="form-control"
                id="ambito_id"
                name="ambito_id"
                value={actividad.ambito_id}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un ámbito</option>
                {ambitos.map((ambito) => (
                  <option key={ambito.id} value={ambito.id}>
                    {ambito.nombre_ambito}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="horas_art140" className="form-label">Numero de Horas</label>
              <input
                type="number"
                className="form-control"
                id="horas_art140"
                name="horas_art140"
                value={actividad.horas_art140}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="cupos" className="form-label">Cupos</label>
              <input
                type="number"
                className="form-control"
                id="cupos"
                name="cupos"
                value={actividad.cupos}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="fecha" className="form-label">Fecha</label>
              <input
                type="date"
                className="form-control"
                id="fecha"
                name="fecha"
                value={actividad.fecha}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3 mb-3">
              <label htmlFor="hora_inicio" className="form-label">Hora Inicio</label>
              <input
                type="text"
                className="form-control"
                id="hora_inicio"
                name="hora_inicio"
                value={actividad.hora_inicio}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3 mb-3">
              <label htmlFor="hora_final" className="form-label">Hora Final</label>
              <input
                type="text"
                className="form-control"
                id="hora_final"
                name="hora_final"
                value={actividad.hora_final}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="objetivos" className="form-label">Objetivos</label>
              <textarea
                className="form-control"
                id="objetivos"
                name="objetivos"
                value={actividad.objetivos}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="descripcion" className="form-label">Descripción</label>
              <textarea
                className="form-control"
                id="descripcion"
                name="descripcion"
                value={actividad.descripcion}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="actividades_principales" className="form-label">Actividades Principales</label>
              <textarea
                className="form-control"
                id="actividades_principales"
                name="actividades_principales"
                value={actividad.actividades_principales}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="observaciones" className="form-label">Observaciones</label>
              <textarea
                className="form-control"
                id="observaciones"
                name="observaciones"
                value={actividad.observaciones}
                onChange={handleChange}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Actividad'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ActividadForm;

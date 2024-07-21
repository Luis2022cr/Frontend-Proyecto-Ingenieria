import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Carrera, fetchCarreraPorId, updateCarrera, createCarrera } from '../../servicios/carreraService';

const CarreraForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [carrera, setCarrera] = useState<Omit<Carrera, 'id'>>({
    nombre_carrera: '',
    descripcion: '',
    facultad: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchCarreraPorId(Number(id))
        .then(data => {
          if (data) setCarrera(data);
        })
        .catch(() => {
          setError('Error fetching carrera');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCarrera(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await updateCarrera(Number(id), carrera);
      } else {
        await createCarrera(carrera);
      }
      navigate('/carreras');
    } catch (error) {
      setError('Error saving carrera');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>{id ? 'Editar Carrera' : 'Crear Carrera'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre_carrera" className="form-label">Nombre de la Carrera</label>
          <input
            type="text"
            className="form-control"
            id="nombre_carrera"
            name="nombre_carrera"
            value={carrera.nombre_carrera}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <input
            type="text"
            className="form-control"
            id="descripcion"
            name="descripcion"
            value={carrera.descripcion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="facultad" className="form-label">Facultad</label>
          <input
            type="text"
            className="form-control"
            id="facultad"
            name="facultad"
            value={carrera.facultad}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {id ? 'Actualizar' : 'Crear'}
        </button>
      </form>
    </div>
  );
};

export default CarreraForm;

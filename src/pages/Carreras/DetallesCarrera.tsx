import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Carrera, fetchCarreraPorId } from '../../servicios/carreraService';

const DetallesCarreras: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [carrera, setCarrera] = useState<Carrera | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerCarrera = async () => {
      setLoading(true);
      setError(null);
      try {
        const carrera = await fetchCarreraPorId(Number(id));
        setCarrera(carrera);
      } catch (error) {
        setError('Error fetching carrera');
        console.error('Error fetching carrera:', error);
      } finally {
        setLoading(false);
      }
    };

    obtenerCarrera();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!carrera) {
    return <div>No se encontró la carrera.</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Detalles de la Carrera</h2>
      <p><strong>ID:</strong> {carrera.id}</p>
      <p><strong>Nombre:</strong> {carrera.nombre_carrera}</p>
      <p><strong>Descripción:</strong> {carrera.descripcion}</p>
      <p><strong>Facultad:</strong> {carrera.facultad}</p>
      <Link to="/carreras" className="btn btn-primary">Volver</Link>
    </div>
  );
};

export default DetallesCarreras;

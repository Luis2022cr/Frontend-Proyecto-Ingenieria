import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Carrera, fetchCarreras } from '../../servicios/carreraService';
import { Modal, Button } from 'react-bootstrap';
import '../../components/style.css';

const Carreras: React.FC = () => {
  //Variables a usar
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const navigate = useNavigate();

  //Validar que los datos esten bien
  useEffect(() => {
    const obtenerCarreras = async () => {
      setLoading(true);
      setError(null);
      try {
        const carreras = await fetchCarreras();
        setCarreras(carreras);
      } catch (error) {
        setError('Error fetching carreras');
        console.error('Error fetching carreras:', error);
      } finally {
        setLoading(false);
      }
    };

    obtenerCarreras();
  }, []);

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    navigate('/carreras'); // Navigate back to the carreras page
  };

  //Mostrar mientras se hace la consulta
  if (loading) {
    return <div>Loading...</div>;
  }

  //Aqui se crea y gestiona la interfaz HTML y CSS
  return (
    <div className="container mt-5">
  <h2>Carreras</h2>
  <Link to="/carreras/nueva" className="btn btn-primary mb-3">Crear Carrera</Link>
  <div className="table-responsive">
    <table className="table text-center">
      <thead>
        <tr className="table-custom-warning">
          <th scope="col">#</th>
          <th scope="col">Nombre</th>
          <th scope="col">Descripción</th>
          <th scope="col">Facultad</th>
          <th scope="col">Ver detalles</th>
          <th scope="col">Editar</th>
        </tr>
      </thead>
      <tbody>
        {carreras.map(carrera => (
          <tr key={carrera.id}>
            <th scope="row">{carrera.id}</th>
            <td>{carrera.nombre_carrera}</td>
            <td>{carrera.descripcion}</td>
            <td>{carrera.facultad}</td>
            <td>
              <Link to={`/carreras/${carrera.id}`} className="btn btn-info">Ver</Link>
            </td>
            <td>
              <Link to={`/carreras/editar/${carrera.id}`} className="btn btn-warning">Editar</Link>
            </td>
           
          </tr>
        ))}
      </tbody>
    </table>
  </div>


  <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
    <Modal.Header closeButton>
      <Modal.Title>Error</Modal.Title>
    </Modal.Header>
    <Modal.Body>{error}</Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={handleCloseErrorModal}>
        Cerrar
      </Button>
    </Modal.Footer>
  </Modal>
</div>

  );
};

export default Carreras;

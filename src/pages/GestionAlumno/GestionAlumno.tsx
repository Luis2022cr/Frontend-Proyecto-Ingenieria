import React, { useEffect, useState } from 'react';
//import { Link, useNavigate } from 'react-router-dom';
import {Row, Col, Modal, Button } from 'react-bootstrap';
import '../../components/style.css';
import logoVoae from '../../media/logo_voae.png';
import { Actividad, fetchActividades } from '../../servicios/actividadService';

const HorasAlumno: React.FC = () => {

  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal] = useState<boolean>(false);
  //const navigate = useNavigate();

  useEffect(() => {
    const obtenerActividades = async () => {
      setLoading(true);
      setError(null);
      try {
        const actividades = await fetchActividades();
        setActividades(actividades);
      } catch (error) {
        setError('Error fetching actividades');
        console.error('Error fetching actividades:', error);
      } finally {
        setLoading(false);
      }
    };

    obtenerActividades();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  function handleCloseErrorModal(): void {
    throw new Error('Function not implemented.');
  }

  return ( 
  //Parte superios, Filtros de busqueda
  <div className="container mt-5">
  <Row>
    <Col className='centrarContenido'><img src={logoVoae} className='voaeLogo'></img></Col>
    <Col md={7}>
        <div className='left-aligned'>
          <Row className='mt-5'>
              <Col>
                <select className='form-select'>
                  <option selected>Carrera</option>
                </select>
              </Col>
              <Col>
                <input type="date" className='form-control' placeholder='test'/>
              </Col>
              <Col>
                <input type="date" className='form-control'/>
              </Col>
          </Row>
        </div>
        <div className='left-aligned'>
          <Row className='mt-4'>
              <Col>
                <select className='form-select'>
                  <option selected>Ambito</option>
                </select>
              </Col>
                <Col>
                  <input type='text' className='form-control' placeholder='Actividad...'></input>
                </Col>
              <Col>
                <button type="button" className="btn botonCustom">Filtrar</button>
              </Col>
          </Row>
        </div>
      </Col>
  </Row>
  <div className="table-responsive mt-5">
    <table className="table text-center">
      <thead>
        <tr className="table-custom-warning">
          <th scope="col">Nombre</th>
          <th scope="col">Descripción</th>
          <th scope="col">Ubicacion</th>
          <th scope="col">Carrera</th>
          <th scope="col">Ambito</th>
          <th scope="col">Horas</th>
          <th scope="col">Cupos</th>
          <th scope="col">Fecha</th>
          <th scope="col">Inicio</th>
          <th scope="col">Final</th>
          <th scope="col">Unirse/Cancelar</th>
        </tr>
      </thead>
      <tbody>
        {actividades.map(actividad => (
            <tr key={actividad.id}>
              <td>{actividad.nombre_actividad}</td>
              <td>{actividad.descripcion}</td>
              <td>{actividad.ubicacion}</td>
              <td>{actividad.carrera}</td>
              <td>{actividad.ambito}</td>
              <td>{actividad.horas_art140}</td>
              <td>{actividad.cupos}</td>
              <td>{actividad.fecha}</td>
              <td>{actividad.hora_inicio}</td>
              <td>{actividad.hora_final}</td>
              <td>
                boton1 y boton2
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

export default HorasAlumno;

//import React, { useEffect, useState } from 'react';
//import { Link, useNavigate } from 'react-router-dom';
import {Row, Col } from 'react-bootstrap';
import '../../components/style.css';
import logoVoae from '../../media/logo_voae.png';
import useAuth from '../../api/useAuth';


const GestionAlumno: React.FC = () => {
    const { numeroUsuario } = useAuth();
  // const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>(null);
  // const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  // const navigate = useNavigate();

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return ( 
  //Parte superios, Filtros de busqueda
  <div className="container mt-5">
  <Row>
    <Col className='centrarContenido'><img src={logoVoae} className='voaeLogo'></img></Col>
    <Col md={7}>
        <div className='left-aligned'>
          <Row className='mt-5'>
              <Col><strong>Numero de cuenta: {numeroUsuario}</strong></Col>
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
        </tr>
      </thead>
      <tbody>
        
      </tbody>
    </table>
  </div>
</div>

  );
};

export default GestionAlumno;

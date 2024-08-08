import React, { useEffect, useState } from 'react';
import { Row, Col, Modal, Button, Form } from 'react-bootstrap';
import logoVoae from '../../media/logo_voae.png';
import { Actividad, fetchActividades } from '../../servicios/actividadService';
import { ActividadUser,  fetchActividadesAlumnoPorIdUnido } from '../../servicios/actividadParticipanteService';
import { añadirParticipante, quitarParticipante } from '../../servicios/actividadParticipanteService';
import axiosInstance from '../../api/axiosInstance';
import '../../components/style.css';
import "bootstrap-icons/font/bootstrap-icons.css";

// Cambiar formato de la fecha a dd/mm/aaaa
const formatDate = (isoDateString: string | number | Date) => {
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Datos de carrera para filtros
interface Carrera {
  id: number;
  nombre_carrera: string;
}

// Datos de ambito para filtros
interface Ambito {
  id: number;
  nombre_ambito: string;
}

// Datos que se usarán en los filtros
const HorasAlumno: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre_actividad: '',
    carrera_id: '',
    ambito_id: '',
    fecha_inicio: '',
    fecha_final: ''
  });

  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [actividadesUser, setActividadesUser] = useState<ActividadUser[]>([]);
  const [filteredActividades, setFilteredActividades] = useState<Actividad[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [ambitos, setAmbitos] = useState<Ambito[]>([]);
  const userId = localStorage.getItem('userId');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  useEffect(() => {
    const obtenerActividades = async () => {
      setLoading(true);
      setError(null);
      try {
        const actividades = await fetchActividades();
        setActividades(actividades);
        setFilteredActividades(actividades); // Inicialmente, muestra todas las actividades
      } catch (error) {
        setError('Error fetching actividades');
        console.error('Error fetching actividades:', error);
      } finally {
        setLoading(false);
      }
    };
    obtenerActividades();
  }, []);

  // Obtener lista de carreras
  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        const response = await axiosInstance.get('/carreras');
        setCarreras(response.data);
      } catch (err) {
        console.error('Error fetching carreras:', err);
        setError('Error al obtener las carreras. Inténtalo de nuevo.');
      }
    };
    fetchCarreras();
  }, []);

  // Obtener lista de ámbitos
  useEffect(() => {
    const fetchAmbitos = async () => {
      try {
        const response = await axiosInstance.get('/ambitos');
        setAmbitos(response.data);
      } catch (err) {
        console.error('Error fetching ámbitos:', err);
        setError('Error al obtener los ámbitos. Inténtalo de nuevo.');
      }
    };
    fetchAmbitos();
  }, []);

  // Obtener id del dato seleccionado
  const handleChange = (e: React.ChangeEvent<HTMLElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    setFormData({ ...formData, [target.name]: target.value });
  };

  // Gestión de los filtros y sus parámetros
  const handleFiltrar = () => {
    const { carrera_id, ambito_id, nombre_actividad, fecha_inicio, fecha_final } = formData;
    let filtered = actividades;

    // Filtrar por nombre de actividad
    if (nombre_actividad) {
      filtered = filtered.filter(actividad =>
        actividad.nombre_actividad.toLowerCase().includes(nombre_actividad.toLowerCase())
      );
    }

    // Filtrar por nombre de ámbito
    if (ambito_id) {
      const selectedAmbito = ambitos.find(ambito => ambito.id === parseInt(ambito_id));
      if (selectedAmbito) {
        filtered = filtered.filter(actividad => actividad.ambito === selectedAmbito.nombre_ambito);
      }
    }

    // Filtrar por nombre de carrera
    if (carrera_id) {
      const selectedCarrera = carreras.find(carrera => carrera.id === parseInt(carrera_id));
      if (selectedCarrera) {
        filtered = filtered.filter(actividad => actividad.carrera === selectedCarrera.nombre_carrera);
      }
    }

    // Filtrar por rango de fechas
    if (fecha_inicio || fecha_final) {
      filtered = filtered.filter(actividad => {
        const actividadFecha = new Date(actividad.fecha);
        const inicio = fecha_inicio ? new Date(fecha_inicio) : new Date('1900-01-01');
        const fin = fecha_final ? new Date(fecha_final) : new Date('2100-12-31');
        return actividadFecha >= inicio && actividadFecha <= fin;
      });
    }

    setFilteredActividades(filtered);
  };

//Lista de actividades del usuario
useEffect(() => {
  const obtenerActividades = async () => {
    setLoading(true);
    setError(null);
    try {
      const actividadesAlumno = await fetchActividadesAlumnoPorIdUnido(Number(userId));
      if (actividadesAlumno) {
        setActividadesUser(actividadesAlumno.actividades);
      }
    } catch (error) {
      setError('Error fetching actividades');
      console.error('Error fetching actividades:', error);
    } finally {
      setLoading(false);
    }
  };
  obtenerActividades();
}, [userId]);

  //Unirse a una actividad
  const handleUnirse = async (id_actividad: number) => {
    if (!userId) return;

    try {
      await añadirParticipante({ id_usuario: Number(userId), id_actividad });
      const actividadesAlumno = await fetchActividadesAlumnoPorIdUnido(Number(userId));
      if (actividadesAlumno) {
        setActividadesUser(actividadesAlumno.actividades);
      }
      setShowSuccessModal(true);
    
    } catch (error) {
      setError('Error al unirse a la actividad.');
      setShowErrorModal(true);
    }
  };

  //Cancelar una actividad
  const handleEliminar = async (id_actividad: number) => {
    if (!userId) return;

    try {
      await quitarParticipante({ id_usuario: Number(userId), id_actividad });
      setShowSuccessModal(true);
    } catch (error) {
      setError('Error al cancelar a la actividad.');
      setShowErrorModal(true);
    }
  };

  //Revisar si el usuario ya esta participando en una actividad
  const isParticipated = (id_actividad: number) => {
    return actividadesUser.some(actividad => actividad.id === id_actividad);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleCloseErrorModal = () => setShowErrorModal(false);
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    window.location.reload();
  };

  return (
    <div className="container mt-5">
      <Row>
        <Col className='centrarContenido'>
          <img src={logoVoae} className='voaeLogo' alt="logo" />
        </Col>
        <Col md={7}>
          <div className='left-aligned'>
            <Row className='mt-5'>
              {/*Filtro de carrera*/}
              <Col>
                <Form.Group controlId="formCarreraId">
                  <Form.Control
                    as="select"
                    name="carrera_id"
                    value={formData.carrera_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Carrera</option>
                    {carreras.map(carrera => (
                      <option key={carrera.id} value={carrera.id}>
                        {carrera.nombre_carrera}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>

              {/*Filtro de rango de fechas*/}
              <Col>
                <input
                  type="date"
                  className='form-control'
                  name="fecha_inicio"
                  value={formData.fecha_inicio}
                  onChange={handleChange}
                />
              </Col>
              <Col>
                <input
                  type="date"
                  className='form-control'
                  name="fecha_final"
                  value={formData.fecha_final}
                  onChange={handleChange}
                />
              </Col>
            </Row>
          </div>

          <div className='left-aligned'>
            <Row className='mt-4'>
              {/*Filtro por ambito*/}
              <Col>
                <Form.Group controlId="formAmbitoId">
                  <Form.Control
                    as="select"
                    name="ambito_id"
                    value={formData.ambito_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Ámbito</option>
                    {ambitos.map(ambito => (
                      <option key={ambito.id} value={ambito.id}>
                        {ambito.nombre_ambito}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>

              {/*Filtro por nombre de la actividad*/}
              <Col>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Nombre de actividad'
                  name="nombre_actividad"
                  value={formData.nombre_actividad}
                  onChange={handleChange}
                />
              </Col>

              {/*Boton para activar los filtros*/}
              <Col>
                <button type="button" className="btn botonCustom" onClick={handleFiltrar}>Filtrar</button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      
      <div className="table-responsive mt-5">
      <table className="table text-center small-text">
      <thead>
            <tr className="table-custom-warning">
              <th scope="col">Nombre</th>
              <th scope="col">Descripción</th>
              <th scope="col">Ubicación</th>
              <th scope="col">Carrera</th>
              <th scope="col">Ámbito</th>
              <th scope="col">Horas</th>
              <th scope="col">Cupos</th>
              <th scope="col">Fecha</th>
              <th scope="col">Unirse/Cancelar</th>
            </tr>
          </thead>
          <tbody>
            {filteredActividades.map(actividad => (
              <tr key={actividad.id}>
                <td>{actividad.nombre_actividad}</td>
                <td>{actividad.descripcion}</td>
                <td>{actividad.ubicacion}</td>
                <td>{actividad.carrera}</td>
                <td>{actividad.ambito}</td>
                <td>{actividad.horas_art140}</td>
                <td>{actividad.cupos_disponibles}</td>
                <td>{formatDate(actividad.fecha)} {actividad.hora_inicio} - {actividad.hora_final}</td>
                <td>
                  {/*Boton para unirse a las actividades*/}
                  
                  <button 
                    className="btn botonUnirse"
                    onClick={() => handleUnirse(actividad.id)}
                    disabled={isParticipated(actividad.id)}
                  >
                    <i className="bi bi-plus-circle-fill"></i>
                  </button>

                  {/*Boton para cancelar una actividad No esta listo*/}
                  <button 
                    className="btn botonCancelar"
                    onClick={() => handleEliminar(actividad.id)}
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*En caso de fallo al unirse a actividad*/}
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

      {/*En caso de exito al unirse a actividad*/}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Éxito</Modal.Title>
        </Modal.Header>
        <Modal.Body>La operacion se a realizado con exito.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseSuccessModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HorasAlumno;

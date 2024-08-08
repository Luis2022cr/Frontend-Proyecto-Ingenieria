import React, { useEffect, useState } from 'react';
import { Row, Col, Modal, Button, Form } from 'react-bootstrap';
import logoVoae from '../../media/logo_voae.png';
import { Solicitud, fetchSolicitudes, actualizarEstadoActividad} from '../../servicios/solicitudVoaeService';
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

// Datos de ámbito para filtros
interface Ambito {
  id: number;
  nombre_ambito: string;
}

const GestiónSolicitud: React.FC = () => {
  const [formData, setFormData] = useState({
    estado: '',
    carrera_id: '',
    ambito_id: '',
    fecha_inicio: '',
    fecha_final: ''
  });

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState<Solicitud[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [ambitos, setAmbitos] = useState<Ambito[]>([]);
  const [observacion, setObservacion] = useState<string>("");
  const [currentSolicitudId, setCurrentSolicitudId] = useState<number | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showObservacionesModal, setShowObservacionesModal] = useState<boolean>(false);

  //Obtener la lista de actividades en forma de solicitudes
  useEffect(() => {
    const obtenerSolicitudes = async () => {
      setLoading(true);
      setError(null);
      try {
        const solicitudes = await fetchSolicitudes();
        setSolicitudes(solicitudes);
        setFilteredSolicitudes(solicitudes); // Inicialmente, muestra todas las solicitudes
      } catch (error) {
        setError('Error fetching solicitudes');
        console.error('Error fetching solicitudes:', error);
      } finally {
        setLoading(false);
      }
    };
    obtenerSolicitudes();
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
    const { carrera_id, ambito_id, estado, fecha_inicio, fecha_final } = formData;
    let filtered = solicitudes;

    //Filtrar por estado de las solicitudes
    if (estado) {
      filtered = filtered.filter(solicitud =>
        solicitud.estado.toLowerCase().includes(estado.toLowerCase())
      );
    }

    // Filtrar por nombre de ámbito
    if (ambito_id) {
      const selectedAmbito = ambitos.find(ambito => ambito.id === parseInt(ambito_id));
      if (selectedAmbito) {
        filtered = filtered.filter(solicitud => solicitud.ambito === selectedAmbito.nombre_ambito);
      }
    }

    // Filtrar por nombre de carrera
    if (carrera_id) {
      const selectedCarrera = carreras.find(carrera => carrera.id === parseInt(carrera_id));
      if (selectedCarrera) {
        filtered = filtered.filter(solicitud => solicitud.carrera === selectedCarrera.nombre_carrera);
      }
    }

    // Filtrar por rango de fechas
    if (fecha_inicio || fecha_final) {
      filtered = filtered.filter(solicitud => {
        const solicitudFecha = new Date(solicitud.fecha);
        const inicio = fecha_inicio ? new Date(fecha_inicio) : new Date('1900-01-01');
        const fin = fecha_final ? new Date(fecha_final) : new Date('2100-12-31');
        return solicitudFecha >= inicio && solicitudFecha <= fin;
      });
    }

    setFilteredSolicitudes(filtered);
  };

  //En caso de Aprobar una solicitud
  const handleAprobar = async (id: number) => {
    setLoading(true);
    try {
      await actualizarEstadoActividad(id, { estado: 2 });
      setShowSuccessModal(true);
      setLoading(false);
    } catch (error) {
      setError(error as string);
      setShowErrorModal(true);
      setLoading(false);
    }
  };

  //Revisar el estado de una solicitud
  const estaAprobado = (solicitud: Solicitud) => {
    return solicitud.estado === "Aprobado";
  };
  
  //En caso de rechazar la solicitud
  const handleRechazar = async (id: number, observacion: string) => {
    setLoading(true);
    try {
      await actualizarEstadoActividad(id, { estado: 3, observacion });
      setLoading(false);
      setShowObservacionesModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      setError(error as string);
      setShowErrorModal(true);
      setLoading(false);
    }
  };

  //Mantener los datos y abrir el Modal para el rechazo y enviar observacion
  const openObservacionesModal = (id: number) => {
    setCurrentSolicitudId(id);
    setShowObservacionesModal(true);
  };

  const handleCloseErrorModal = () => setShowErrorModal(false);
  const handleCloseSuccessModal = () => setShowSuccessModal(false);
  const handleCloseObservacionesModal = () => setShowObservacionesModal(false);

  if (loading) {
    return <div>Loading...</div>;
  }

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

              {/*Filtro por estado*/}
              <Col>
              <Form.Group controlId="formAmbitoId">
                  <Form.Control
                    as="select"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Estado</option>
                    <option value="En Revision">En revisión</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Rechazado">Rechazado</option>
                    <option value="Finalizado">Finalizado</option>
                  </Form.Control>
                </Form.Group>
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
              <th scope="col">Objetivos</th>
              <th scope="col">Descripción</th>
              <th scope="col">Ubicación</th>
              <th scope="col">Carrera</th>
              <th scope="col">Ámbito</th>
              <th scope="col">Horas</th>
              <th scope="col">Cupos</th>
              <th scope="col">Fecha</th>
              <th scope="col">Aprobar/Rechazar</th>
            </tr>
          </thead>
          <tbody>
            {filteredSolicitudes.map(solicitud => (
              <tr key={solicitud.id}>
                <td>{solicitud.nombre_actividad}</td>
                <td>{solicitud.objetivos}</td>
                <td>{solicitud.descripcion}</td>
                <td>{solicitud.ubicacion}</td>
                <td>{solicitud.carrera}</td>
                <td>{solicitud.ambito}</td>
                <td>{solicitud.horas_art140}</td>
                <td>{solicitud.cupos_disponibles}</td>
                <td>{formatDate(solicitud.fecha)} {solicitud.hora_inicio} - {solicitud.hora_final}</td>
                <td>
                  {/*Aprobar Solicitud*/}
                  <button 
                    className="btn botonUnirse"
                    onClick={() => handleAprobar(solicitud.id)}
                    disabled={estaAprobado(solicitud)}
                  >
                    <i className="bi bi-check-circle-fill"></i>
                  </button>
                  {/*Rechazar solicitud*/}
                  <button 
                    className="btn botonCancelar" 
                    onClick={() => openObservacionesModal(solicitud.id)}
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*En caso de fallo al aprobar/rechazar solicitud*/}
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

      {/*En caso de éxito al aprobar/rechazar solicitud*/}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Éxito</Modal.Title>
        </Modal.Header>
        <Modal.Body>La operación se ha realizado con éxito.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseSuccessModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/*Observaciones y gestion del rechazo de solicitud*/}
      <Modal show={showObservacionesModal} onHide={handleCloseObservacionesModal}>
        <Modal.Header closeButton>
          <Modal.Title>Observaciones de solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control 
            as="textarea" 
            placeholder='Observaciones (Obligatorio)' 
            rows={3} 
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" 
            onClick={() => currentSolicitudId && handleRechazar(currentSolicitudId, observacion)}
            disabled={observacion.trim() === ""}
            >
            Enviar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestiónSolicitud;

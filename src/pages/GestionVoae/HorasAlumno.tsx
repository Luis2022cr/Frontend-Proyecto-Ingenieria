import axiosInstance from '../../api/axiosInstance';
import React, { useEffect, useState } from 'react';
import { Row, Col, Modal, Button, Form } from 'react-bootstrap';
import { ActividadUser, fetchActividadesAlumnoPorId } from '../../servicios/actividadParticipanteService';
import { fetchCarreraPorId } from '../../servicios/carreraService';
import useAuth from '../../api/useAuth';
import logoVoae from '../../media/logo_voae.png';
import '../../components/style.css';
import "bootstrap-icons/font/bootstrap-icons.css";


//Cambiar formato de la fecha a dd/mm/aaaa
const formatDate = (isoDateString: string | number | Date) => {
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

//Datos de ambitos para filtros
interface Ambito {
  id: number;
  nombre_ambito: string;
}

//Datos que se usaran en los filtros
const HorasAlumnoPorUsuario: React.FC = () => {
  const [formData, setFormData] = useState({
    numero_cuenta: '',
    ambito_id: '',
    fecha_inicio: '',
    fecha_final: ''
  });

  const { numeroUsuario } = useAuth();
  const userId = localStorage.getItem('userId');
  const [actividades, setActividades] = useState<ActividadUser[]>([]);
  const [filteredActividades, setFilteredActividades] = useState<ActividadUser[]>([]);
  const [ambitos, setAmbitos] = useState<Ambito[]>([]);
  const [nombresAmbitos, setNombresAmbitos] = useState<Record<number, string>>({});
  const [nombresCarreras, setNombresCarreras] = useState<Record<number, string>>({});

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);

  //Obtener nombre de una carrera por el id
  const obtenerNombreCarrera = async (id: number) => {
    try {
      const carrera = await fetchCarreraPorId(id);
      if (carrera) {
        setNombresCarreras(prevState => ({ ...prevState, [id]: carrera.nombre_carrera }));
      }
    } catch (error) {
      console.error('Error fetching carrera:', error);
    }
  };

  //Lista de actividades del usuario
  useEffect(() => {
    const obtenerActividades = async () => {
      setLoading(true);
      setError(null);
      try {
        const actividadesAlumno = await fetchActividadesAlumnoPorId(Number(userId));
        if (actividadesAlumno) {
          setActividades(actividadesAlumno.actividades);
          setFilteredActividades(actividadesAlumno.actividades); // Inicialmente, muestra todas las actividades del usuario

        // Obtener nombres de carreras
        const idsCarreras = [...new Set(actividadesAlumno.actividades.map(a => a.carrera_id))];
        idsCarreras.forEach(id => obtenerNombreCarrera(id));
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

  //Obtener lista de ambitos
  useEffect(() => {
    const fetchAmbitos = async () => {
      try {
        const response = await axiosInstance.get('/ambitos');
        const ambitos = response.data;
        setAmbitos(ambitos);
  
        // Mapea los IDs a nombres
        const ambitosMap = ambitos.reduce((acc: Record<number, string>, ambito: Ambito) => {
          acc[ambito.id] = ambito.nombre_ambito;
          return acc;
        }, {});
  
        setNombresAmbitos(ambitosMap);
      } catch (err) {
        console.error('Error fetching ámbitos:', err);
        setError('Error al obtener los ámbitos. Inténtalo de nuevo.');
      }
    };
    fetchAmbitos();
  }, []);
  

  //Obtener id del dato seleccionado en el filtro
  const handleChange = (e: React.ChangeEvent<HTMLElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    setFormData({ ...formData, [target.name]: target.value });
  };

  //Gestion de los filtros y sus parametros
  const handleFiltrar = () => {
    const {ambito_id, numero_cuenta, fecha_inicio, fecha_final } = formData;
    let filtered = actividades;

    // Filtrar por nombre de actividad
    if (numero_cuenta) {
      filtered = filtered.filter(actividad =>
        actividad.nombre_actividad.toLowerCase().includes(numero_cuenta.toLowerCase())
      );
    }

    // Filtrar por nombre de ámbito
    if (ambito_id) {
      const selectedAmbito = ambitos.find(ambito => ambito.id === parseInt(ambito_id));
      if (selectedAmbito) {
        filtered = filtered.filter(actividad => nombresAmbitos[actividad.ambito_id] === selectedAmbito.nombre_ambito);
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
  

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleCloseErrorModal = () => setShowErrorModal(false);

  return (
    //Parte superior, Filtros
    <div className="container mt-5">
      <Row>
        <Col className='centrarContenido'>
          <img src={logoVoae} className='voaeLogo' alt="logo" />
        </Col>
        <Col md={7}>
          <div className='left-aligned'>
            <Row className='mt-5'>
              {/*No de cuenta del usuario*/}
              <Col>
                <strong>Numero de cuenta: {numeroUsuario}</strong>
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
                  placeholder='Numero de cuenta'
                  name="numero_cuenta"
                  value={formData.numero_cuenta}
                  onChange={handleChange}
                />
              </Col>

              {/*Boton para aplicar los filtros*/}
              <Col>
                <button type="button" className="btn botonCustom" onClick={handleFiltrar}>Filtrar</button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      
      {/*Tabla de los datos*/}
      <div className="table-responsive mt-5">
        <table className="table text-center">
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
              <th scope="col">Inicio</th>
              <th scope="col">Final</th>
            </tr>
          </thead>
          <tbody>
            {filteredActividades.map(actividad => (
              <tr key={actividad.id}>
                <td>{actividad.nombre_actividad}</td>
                <td>{actividad.descripcion}</td>
                <td>{actividad.ubicacion}</td>
                <td>{nombresCarreras[actividad.carrera_id]}</td>
                <td>{nombresAmbitos[actividad.ambito_id]}</td>
                <td>{actividad.horas_art140}</td>
                <td>{actividad.cupos}</td>
                <td>{formatDate(actividad.fecha)}</td>
                <td>{actividad.hora_inicio}</td>
                <td>{actividad.hora_final}</td>
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

export default HorasAlumnoPorUsuario;
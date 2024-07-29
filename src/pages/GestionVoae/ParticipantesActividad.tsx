import React, { useEffect, useState } from "react";
import { Row, Col, Modal, Button } from "react-bootstrap";
import logoVoae from "../../media/logo_voae.png";
import { Actividad, fetchActividades } from "../../servicios/actividadService";
import "../../components/style.css";
import "bootstrap-icons/font/bootstrap-icons.css";

//Datos que se usaran en los filtros
const ParticipantesActividad: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre_actividad: "",
    carrera_id: "",
    ambito_id: "",
    fecha_inicio: "",
    fecha_final: "",
  });

  const [actividades, setActividades] = useState<Actividad[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);

  useEffect(() => {
    const obtenerActividades = async () => {
      setLoading(true);
      setError(null);
      try {
        const actividades = await fetchActividades();
        setActividades(actividades);
       
      } catch (error) {
        setError("Error fetching actividades");
        console.error("Error fetching actividades:", error);
      } finally {
        setLoading(false);
      }
    };
    obtenerActividades();
  }, []);

 

  //Obtener id del dato seleccionado
  const handleChange = (e: React.ChangeEvent<HTMLElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    setFormData({ ...formData, [target.name]: target.value });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleCloseErrorModal = () => setShowErrorModal(false);

  return (
    //Parte superior, Filtros
    <div className="container mt-5">
      <Row>
        <Col className="centrarContenido">
          <img src={logoVoae} className="voaeLogo" alt="logo" />
        </Col>
        <Col md={7}>
          <div className="left-aligned">
            <Row className="mt-4">
              {/*Filtro por nombre de la actividad*/}
              <Col>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre de actividad"
                  name="nombre_actividad"
                  value={formData.nombre_actividad}
                  onChange={handleChange}
                />
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
              <th scope="col">Numero de Cuenta</th>
            </tr>
          </thead>
          <tbody>
            {actividades.map((actividad) => (
              <tr key={actividad.id}>
                <td>{actividad.nombre_actividad}</td>
                <td>{actividad.descripcion}</td>
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

export default ParticipantesActividad;

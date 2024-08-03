import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Row, Col, Modal, Button } from "react-bootstrap";
import logoVoae from "../../media/logo_voae.png";
import "../../components/style.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { fetchParticipantesPorActividadId, ActividadConParticipantes } from "../../servicios/actividadParticipanteService";

const ParticipantesActividad: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [actividad, setActividad] = useState<ActividadConParticipantes | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);

  useEffect(() => {
    const obtenerParticipantes = async () => {
      if (id) {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchParticipantesPorActividadId(parseInt(id));
          setActividad(data);
        } catch (error) {
          setError('Error al obtener los participantes de la actividad.');
          setShowErrorModal(true);
        } finally {
          setLoading(false);
        }
      }
    };

    obtenerParticipantes();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleCloseErrorModal = () => setShowErrorModal(false);

  return (
    <div className="container mt-5">
      <Row>
        <Col className="centrarContenido">
          <img src={logoVoae} className="voaeLogo" alt="logo" />
        </Col>
        <Col md={7}>
          {actividad && (
            <h2>{actividad.nombre_actividad}</h2>
          )}
        </Col>
      </Row>

      <div className="table-responsive mt-5">
        <table className="table text-center">
          <thead>
            <tr className="table-custom-warning">
              <th scope="col">Nombre</th>
              <th scope="col">Numero de Cuenta</th>
            </tr>
          </thead>
          <tbody>
            {actividad ? (
              actividad.participantes.map(participante => (
                <tr key={participante.id}>
                  <td>{participante.nombre} {participante.apellido}</td>
                  <td>{participante.numero_usuario}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2}>No se encontraron participantes para esta actividad.</td>
              </tr>
            )}
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

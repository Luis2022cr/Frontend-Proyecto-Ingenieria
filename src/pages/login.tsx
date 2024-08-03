import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import useAuth from '../api/useAuth';
import { Button, Form, Container, Alert, Row, Col, Modal } from 'react-bootstrap'; // Importa Modal de react-bootstrap
import { useNavigate } from 'react-router-dom';
import LogoVoae from '../media/logo_voae.png';
import '../components/style.css';

const Login: React.FC = () => {
  const { login, accessToken } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ numero_usuario: '', contrasena: '' });
  const [emailData, setEmailData] = useState({ correo_institucional: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) {
      navigate('/carreras'); // Aquí puedes redirigir a una ruta predeterminada si es necesario
    }
  }, [accessToken, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
  };

  const botonLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/auth/login', formData);
      const { token, id, role_id, numero_usuario } = response.data;
      login(token, id, role_id, numero_usuario);

      setSuccess('Inicio de sesión exitoso');
      setError(null);

      // Redirigir según el rol
      if (role_id === 1) {
        navigate('/gestion_voae');
      } else if (role_id === 2 || role_id === 3) {
        navigate('/gestion_alumno');
      } else {
        // Redirigir a una ruta por defecto o mostrar un error si el rol no está definido
        navigate('/');
      }
    } catch (err) {
      setError('Número de usuario o contraseña incorrectos');
      setSuccess(null);
    }
  };

  const enviarCorreo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/auth/generar-correo-recuperacion', emailData);
      if (response) {
        setModalSuccess('Correo de restablecimiento de contraseña enviado');
        setModalError(null);
      }
    } catch (err) {
      setModalError('El correo institucional no está registrado');
      setModalSuccess(null);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setModalError(null);
    setModalSuccess(null);
  };

  const handleShow = () => setShowModal(true);

  return (
    <div className="login-container">
      <Container className="d-flex flex-column align-items-center">
        <img src={LogoVoae} alt="Login" className="mb-4 imgS" />
        <div className="login-card">
          <h2 className='text-center mb-4'>Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={botonLogin}>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>Número de Usuario</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Control
                  type="text"
                  name="numero_usuario"
                  value={formData.numero_usuario}
                  onChange={handleChange}
                  placeholder="Introduce tu número de usuario"
                  required
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>Contraseña</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Control
                  type="password"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  placeholder="Introduce tu contraseña"
                  required
                />
              </Col>
            </Row>
            <div className="submit-button">
              <Button variant="primary" type="submit">
                Iniciar Sesión
              </Button>
            </div>
          </Form>
          <div className="mt-3 text-center">
            <Button variant="link" onClick={handleShow}>¿Olvidaste tu contraseña?</Button>
          </div>
        </div>
      </Container>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enviar Correo de Recuperación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalError && <Alert variant="danger">{modalError}</Alert>}
          {modalSuccess && <Alert variant="success">{modalSuccess}</Alert>}
          <Form onSubmit={enviarCorreo}>
            <Form.Group className="mb-3">
              <Form.Label>Correo Institucional</Form.Label>
              <Form.Control
                type="email"
                name="correo_institucional"
                value={emailData.correo_institucional}
                onChange={handleEmailChange}
                placeholder="Introduce tu correo institucional"
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Enviar Correo
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Login;

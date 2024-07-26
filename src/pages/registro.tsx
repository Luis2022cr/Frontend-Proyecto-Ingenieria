import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Asegúrate de importar axios si lo usas directamente
import axiosInstance from '../api/axiosInstance';
import { Button, Form, Container, Alert, Row, Col } from 'react-bootstrap';
import LogoVoae from '../media/logo_voae.png';

interface Carrera {
  id: number;
  nombre_carrera: string;
}

const Registro: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo_institucional: '',
    numero_usuario: '',
    contrasena: '',
    confirmacionContrasena: '',
    carrera_id: '',
    role_id: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [carreras, setCarreras] = useState<Carrera[]>([]);

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

  const handleChange = (e: React.ChangeEvent<HTMLElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    setFormData({ ...formData, [target.name]: target.value });
  };

  const botonRegistro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verificar que las contraseñas coincidan
    if (formData.contrasena !== formData.confirmacionContrasena) {
      setError('Las contraseñas no coinciden.');
      setSuccess(null);
      return;
    }

    try {
      const response = await axiosInstance.post('/auth/registro', formData);
      setSuccess(response.data.message);
      setError(null);
      setFormData({
        nombre: '',
        apellido: '',
        correo_institucional: '',
        numero_usuario: '',
        contrasena: '',
        confirmacionContrasena: '',
        carrera_id: '',
        role_id: ''
      });
    } catch (err) {
      // Handle specific errors
      if (axios.isAxiosError(err) && err.response) {
        const errorMsg = err.response.data.error;
        if (errorMsg === 'El correo institucional ya está registrado') {
          setError('El correo institucional ya está registrado. Por favor, usa otro.');
        } else if (errorMsg === 'El número de usuario ya está en uso') {
          setError('El número de Cuenta-Empleado ya está en uso. Por favor, elige otro número.');
        } else {
          setError('Error al registrar el usuario. Inténtalo de nuevo.');
        }
      } else {
        setError('Error al registrar el usuario. Inténtalo de nuevo.');
      }
      setSuccess(null);
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center">
      <div className="registration-logo">
        <img src={LogoVoae} alt="Logo" />
      </div>
      <div className="registration-card">
        <h2 className="text-center mb-4">Registrarse</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={botonRegistro}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Introduce tu nombre"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formApellido">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Introduce tu apellido"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formCorreoInstitucional">
                <Form.Label>Correo Institucional</Form.Label>
                <Form.Control
                  type="email"
                  name="correo_institucional"
                  value={formData.correo_institucional}
                  onChange={handleChange}
                  placeholder="Introduce tu correo institucional"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formNumeroUsuario">
                <Form.Label>Número de Cuenta/Empleado</Form.Label>
                <Form.Control
                  type="text"
                  name="numero_usuario"
                  value={formData.numero_usuario}
                  onChange={handleChange}
                  placeholder="Introduce tu número de usuario"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formContrasena">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  placeholder="Introduce tu contraseña"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formConfirmacionContrasena">
                <Form.Label>Confirmar Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmacionContrasena"
                  value={formData.confirmacionContrasena}
                  onChange={handleChange}
                  placeholder="Confirma tu contraseña"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="formCarreraId" className="mb-3">
            <Form.Label>Carrera</Form.Label>
            <Form.Control
              as="select"
              name="carrera_id"
              value={formData.carrera_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una carrera</option>
              {carreras.map(carrera => (
                <option key={carrera.id} value={carrera.id}>
                  {carrera.nombre_carrera}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formRoleId" className="mb-3">
            <Form.Label>Rol</Form.Label>
            <Form.Control
              as="select"
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un rol</option>
              <option value="1">Administrador</option>
              <option value="2">Coordinador</option>
              <option value="3">Estudiante</option>
            </Form.Control>
          </Form.Group>
          <div className="submit-button">
            <Button variant="primary" type="submit">
              Registrarse
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default Registro;

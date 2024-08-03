import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import { Button, Form, Container, Alert, Row, Col } from 'react-bootstrap';
import LogoVoae from '../media/logo_voae.png';
import '../components/style.css';

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
    carrera_id: 0,
    role_id: 0
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
    const { name, value } = target;
    // Convertir los valores de carrera_id y role_id a números
    if (name === 'carrera_id' || name === 'role_id') {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@unah\.(edu\.hn|hn)$/;
    const numberRegex = /^\d+$/;

    if (!emailRegex.test(formData.correo_institucional)) {
      setError('El correo institucional debe ser de los dominios @unah.hn o @unah.edu.hn.');
      return false;
    }

    if (!numberRegex.test(formData.numero_usuario)) {
      setError('El número de cuenta/empleado debe ser numérico.');
      return false;
    }

    return true;
  };

  const botonRegistro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar el formulario antes de enviar
    if (!validateForm()) {
      setSuccess(null);
      return;
    }

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
        carrera_id: 0,
        role_id: 0
      });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorMsg = err.response.data.error;
        if (errorMsg === 'Ya existe un usuario con este rol en esta carrera') {
          setError('Ya existe un usuario con este rol en esta carrera. Por favor, elige otro rol o carrera.');
        } else if (errorMsg === 'El correo institucional ya está registrado') {
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
        <img src={LogoVoae} alt="Logo" className='imgS'/>
      </div>
      <div className="registration-card">
        <h2 className="text-center mb-4">Registro</h2>
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
              id="carrera_id"
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
              id="role_id"
              value={formData.role_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un rol</option>
              <option value={1}>Administrador</option>
              <option value={2}>Coordinador</option>
              <option value={3}>Estudiante</option>
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

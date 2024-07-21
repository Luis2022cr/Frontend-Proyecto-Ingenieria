import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import useAuth from '../api/useAuth';
import { Button, Form, Container, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { login, accessToken } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ numero_usuario: '', contrasena: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) {
      navigate('/carreras');
    }
  }, [accessToken, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const botonLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/auth/login', formData);
      login(response.data.token, response.data.id, response.data.role_id, response.data.numero_usuario);
      setSuccess('Inicio de sesión exitoso');
      setError(null);
      navigate('/carreras');
    } catch (err) {
      setError('Número de usuario o contraseña incorrectos');
      setSuccess(null);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <Container>
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
        </Container>
      </div>
    </div>
  );
};

export default Login;

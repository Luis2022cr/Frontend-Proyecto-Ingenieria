import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Button, Form, Container, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import LogoVoae from '../media/logo_voae.png';
import '../components/style.css';

const ResetPassword: React.FC = () => {
  const [formData, setFormData] = useState({ token: '', nuevaContrasena: '', confirmacionContrasena: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Extrae el token de la url
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setFormData(prevState => ({ ...prevState, token: token }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.nuevaContrasena !== formData.confirmacionContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axiosInstance.post('/auth/reset-password', formData);
      setSuccess(response.data.message);
      setError(null);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.error || 'Error al restablecer la contraseña');
      } else {
        setError('Error desconocido al restablecer la contraseña');
      }
      setSuccess(null);
    }
  };

  return (
    <div className="reset-password-container">
      <Container className="d-flex flex-column align-items-center">
        <img src={LogoVoae} alt="Reset Password" className="mb-4" />
        <div className="reset-password-card">
          <h2 className='text-center mb-4'>Restablecer Contraseña</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleResetPassword}>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>Nueva Contraseña</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Control
                  type="password"
                  name="nuevaContrasena"
                  value={formData.nuevaContrasena}
                  onChange={handleChange}
                  placeholder="Introduce la nueva contraseña"
                  required
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>Confirmación de Contraseña</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Control
                  type="password"
                  name="confirmacionContrasena"
                  value={formData.confirmacionContrasena}
                  onChange={handleChange}
                  placeholder="Confirma la nueva contraseña"
                  required
                />
              </Col>
            </Row>
            <div className="submit-button">
              <Button variant="primary" type="submit">
                Restablecer Contraseña
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default ResetPassword;

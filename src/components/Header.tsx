import React from 'react';
import { Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../api/useAuth';
import './style.css'; //Importar css extra
import logoUnah from '../media/Logo UNAH.png';

const Header: React.FC = () => {
  const { accessToken, logout, numeroUsuario } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirige a la página de inicio después de cerrar sesión
  };

  return (
    <Navbar className='navbarBackground' variant="dark" expand="lg">
      <Navbar.Brand className='verticalCenter' as={Link} to="/">
      <img src={logoUnah} className='iconNavbar'></img>
        VOAE-CUROC
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Nav>
        <Nav.Link className='text-light verticalCenter mt-1' as={Link} to="/gestion_alumno">Gestion Alumno</Nav.Link>
        <Nav.Link className='text-light verticalCenter mt-1' as={Link} to="/gestion_alumno">Gestion VOAE</Nav.Link>
      </Nav>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {accessToken ? (
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" id="dropdown-custom-components">
                {numeroUsuario}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item className="text-danger" onClick={handleLogout}>
                  Cerrar Sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <>
              <Nav.Link as={Link} to="/login">
                <Button variant="outline-light">Iniciar Sesión</Button>
              </Nav.Link>
              <Nav.Link as={Link} to="/registro">
                <Button variant="outline-light" className="ml-2">Registrarse</Button>
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;

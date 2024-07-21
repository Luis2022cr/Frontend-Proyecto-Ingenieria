// main.tsx
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import './index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { AuthProvider } from './api/AuthContext';
import Layout from './layouts/Layout';
import Registro from './pages/registro';
import Login from './pages/login';
import Carreras from './pages/Carreras/Carreras';
import CarreraForm from './pages/Carreras/CarreraForm';
import DetallesCarreras from './pages/Carreras/DetallesCarrera';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
          <Route path="carreras" element={<Carreras />} />
          <Route path="carreras/:id" element={<DetallesCarreras />} />
          <Route path="carreras/nueva" element={<CarreraForm/>} />
          <Route path="carreras/editar/:id" element={<CarreraForm/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

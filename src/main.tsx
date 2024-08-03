// main.tsx
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { AuthProvider } from "./api/AuthContext";
import Layout from "./layouts/Layout";
import LayoutAlumno from "./layouts/LayoutAlumno";
import LayoutVoae from "./layouts/LayoutVoae";
import Registro from "./pages/registro";
import Login from "./pages/login";
import Carreras from "./pages/Carreras/Carreras";
import CarreraForm from "./pages/Carreras/CarreraForm";
import DetallesCarreras from "./pages/Carreras/DetallesCarrera";
import GestionAlumno from "./pages/GestionAlumno/GestionAlumno";
import HorasAlumno from "./pages/GestionAlumno/HorasAlumno";
import GestionVoae from "./pages/GestionVoae/GestionVoae";
import ParticipantesActividad from "./pages/GestionVoae/ParticipantesActividad";
import ResetPassword from "./pages/ResetPassword";
import ActividadForm from "./pages/Actividades/ActividadForm";
import HorasAlumnoVoae from "./pages/GestionVoae/HorasAlumno";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

//Se colocan las rutas a utilizar y el layout al que pertenecen
root.render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="login" element={<Login />} />
          <Route path="carreras" element={<Carreras />} />
          <Route path="carreras/:id" element={<DetallesCarreras />} />
          <Route path="carreras/nueva" element={<CarreraForm />} />
          <Route path="carreras/editar/:id" element={<CarreraForm />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
      
        <Route path="/" element={<LayoutAlumno />}>
          <Route path="gestion_alumno" element={<GestionAlumno />} />
          <Route path="actividades/crear" element={<ActividadForm />} />
          <Route path="horas_alumno/:id" element={<HorasAlumno />} />
        </Route>
        
        <Route path="/" element={<LayoutVoae />}>
          <Route path="gestion_voae" element={<GestionVoae />} />
          <Route path="registro" element={<Registro />} />
          <Route path="gestion_voae/participantes_actividad" element={<ParticipantesActividad />} />
          <Route path="horas_alumno_voae" element={<HorasAlumnoVoae />} />
        </Route>

      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

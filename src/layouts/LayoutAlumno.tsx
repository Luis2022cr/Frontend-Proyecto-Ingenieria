import { Outlet } from 'react-router-dom';
import Header from '../components/HeaderAlumno';

export default function LayoutAlumno(){
  return (
    <div>
      <Header />
      <main >
        <Outlet />
      </main>
    </div>
  );
}
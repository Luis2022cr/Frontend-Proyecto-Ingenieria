import { Outlet } from 'react-router-dom';
import Header from '../components/HeaderVoae';

export default function LayoutVoae(){
  return (
    <div>
      <Header />
      <main >
        <Outlet />
      </main>
    </div>
  );
}
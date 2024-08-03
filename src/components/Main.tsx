import { useEffect } from "react";
import main from '../media/main.png';

export default function Main() {
  useEffect(() => {
    document.title = "Inicio ";
  }, []);

  const handleContextMenu = (event: React.MouseEvent<HTMLImageElement>) => {
    event.preventDefault();
  };

  const handleDragStart = (event: React.DragEvent<HTMLImageElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <div className="container-fluid p-0 d-flex align-items-center justify-content-center" style={{ height: '85vh' }}>
        <img
          src={main}
          alt="logo main"
          className="w-100 h-100 object-fit-cover"
          onContextMenu={handleContextMenu}
          onDragStart={handleDragStart}
        />
      </div>
    </>
  );
}

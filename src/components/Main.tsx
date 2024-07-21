import { useEffect } from "react";

export default function Main() {
  useEffect(() => {
    document.title = "Inicio ";
  }, []);

  return (
    <>
      <div className="container text-center mt-5">
        <div className="jumbotron">
          <h1 className="display-4">Bienvenido a Mi Aplicación</h1>
          <p className="lead">Esta es una simple aplicación de ejemplo usando React, TypeScript y Bootstrap.</p>
          <hr className="my-4" />
          <p>Para comenzar, edita <code>App.tsx</code> y guarda para recargar.</p>
          <a className="btn btn-primary btn-lg" href="https://react-bootstrap.netlify.app/docs/forms/overview/" target="_blank" rel="noopener noreferrer" role="button">Aprender más</a>
        </div>
      </div>
    </>
  )
}
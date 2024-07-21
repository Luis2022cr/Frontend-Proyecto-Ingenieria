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
      <h2 className="text-center my-5">Ejemplo de tabla</h2>
      <table className="table text-center">
        <thead>
          <tr className="table-custom-warning">
            <th scope="col">#</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th>
            <th scope="col">Handle 2</th>
            <th scope="col">Handle 3</th>
            <th scope="col">Handle 4</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>Thornton</td>
            <td>@fat</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry the Bird</td>
            <td>Larry the Bird</td>
            <td></td>
            <td></td>
            <td>@twitter</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}
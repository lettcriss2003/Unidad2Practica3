"use client"
import React, { useEffect, useState } from "react";
import { getToken, borrarSesion } from "@/hooks/SessionUtil";
import { obtenerRecursos, simple_obtener } from "@/hooks/Conexion";
import Menusesion from "@/componentes/menu_sesion";
import Link from "next/link";
import { obtenerExternalUser, obtenerRolUser } from "@/hooks/SessionUtil";

// Componente principal
export default function Home() {
  const [datos, setDatos] = useState([]);
  const [rolUser, setRolUser] = useState(obtenerRolUser());
  const [fechaActual, setFechaActual] = useState(new Date());
  const [rangoFechas, setRangoFechas] = useState({ inicio: null, fin: null });
  const [busqueda, setBusqueda] = useState("");

  // Función para avanzar a la fecha siguiente
  const irFechaSiguiente = () => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setDate(fechaActual.getDate() + 1);
    setFechaActual(nuevaFecha);
  };

  // Función para retroceder a la fecha anterior
  const irFechaAnterior = () => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setDate(fechaActual.getDate() - 1);
    setFechaActual(nuevaFecha);
  };

  // Función para obtener datos
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const token = getToken();
        const externalUser = obtenerExternalUser();

        if (token) {
          let endpoint = "";
          let resultado = null;

          const fechaFin = fechaActual.toISOString().split("T")[0];
          const fechaInicio = new Date(fechaActual);
          fechaInicio.setDate(fechaActual.getDate() - 15);
          const fechaInicioStr = fechaInicio.toISOString().split("T")[0];

          console.log("Fecha de inicio:", fechaInicioStr);
          console.log("Fecha de fin:", fechaFin);

          if (rolUser === "agente") {
            endpoint = `admin/persona/get/${externalUser}?fechaInicio=${fechaInicioStr}&fechaFin=${fechaFin}`;
            const response = await obtenerRecursos(endpoint, token);
            resultado = response.datos.venta.filter((venta) => {
              const fechaVenta = new Date(venta.fecha.replace(/-/g, "/"));
              console.log("Fecha de la venta:", fechaVenta.toISOString().split("T")[0]);
              return (
                fechaVenta >= fechaInicio &&
                fechaVenta <= fechaActual &&
                venta.nombre_cliente.toLowerCase().includes(busqueda.toLowerCase())
              );
            });
          } else if (rolUser === "gerente") {
            endpoint = `gerente/documentos?fechaInicio=${fechaInicioStr}&fechaFin=${fechaFin}`;
            const response = await obtenerRecursos(endpoint, token);
            resultado = response.datos;
          }

          console.log("Resultados después del filtrado:", resultado);

          setDatos(resultado);
          setRangoFechas({ inicio: fechaInicioStr, fin: fechaFin });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    obtenerDatos();
  }, [rolUser, fechaActual, busqueda]);

  // Renderiza la interfaz
  return (
    <div className="row">
      <header>
        <Menusesion />
      </header>
      <figure className="text-center">
        <h1 style={{ color: "#3498db" }}>
          {rolUser === "agente" ? "LISTA DE VENTAS" : "LISTA DE DOCUMENTOS"}
        </h1>
      </figure>
      <div className="container-fluid">
        {rolUser === "agente" && (
          <div className="col-4" style={{ margin: "10px" }}>
            <button className="btn btn-primary" onClick={irFechaAnterior}>
              Anterior
            </button>
            <button className="btn btn-primary" onClick={irFechaSiguiente}>
              Siguiente
            </button>
          </div>
        )}
        <div className="col-4" style={{ margin: "10px" }}>
          {rolUser === "agente" ? (
            <Link href="/nuevo">
              <button
                className="btn btn-primary"
                style={{ backgroundColor: "#2ecc71", color: "#fff" }}
              >
                NUEVO
              </button>
            </Link>
          ) : (
            <Link href="/nuevodoc">
              <button
                className="btn btn-primary"
                style={{ backgroundColor: "#2ecc71", color: "#fff" }}
              >
                NUEVO
              </button>
            </Link>
          )}
        </div>

        {/* Campo de búsqueda condicional */}
        {rolUser === "agente" && (
          <div className="col-4" style={{ margin: "10px" }}>
            <input
              type="text"
              placeholder="Buscar por nombre cliente"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        )}

        {/* Título del rango de fechas */}
        {rolUser === "agente" && (
          <div className="col-12" style={{ margin: "10px" }}>
            <h3>Rango de fechas: {rangoFechas.inicio} - {rangoFechas.fin}</h3>
          </div>
        )}

        <div className="table-responsive">
          {Array.isArray(datos) && datos.length > 0 ? (
            <table
              className="table table-hover table-bordered table-striped"
              style={{ backgroundColor: "#e6f7ff" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th>Nro</th>
                  {rolUser === "agente" ? (
                    <>
                      <th>Cliente</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Subtotal</th>
                      <th>Celular</th>
                      <th>Editar</th>
                    </>
                  ) : (
                    <>
                      <th>Tipo_documento</th>
                      <th>Autor</th>
                      <th>Sinopsis</th>
                      <th>Genero</th>
                      <th>Precio</th>
                      <th>Estado</th>
                      <th>Archivos</th>
                      <th>Acciones</th>
                      <th>Editar</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {datos.map((dato, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    {rolUser === "agente" ? (
                      <>
                        <td>{dato.nombre_cliente}</td>
                        <td>{dato.fecha}</td>
                        <td>{dato.total}</td>
                        <td>{dato.subtotal}</td>
                        <td>{dato.celular_cliente}</td>
                      </>
                    ) : (
                      <>
                        <td>{dato.tipo_documento}</td>
                        <td>{dato.autor}</td>
                        <td>{dato.sinopsis}</td>
                        <td>{dato.genero}</td>
                        <td>{dato.precio}</td>
                        <td>{dato.estado ? "Sin Vender" : "Vendido"}</td>
                        <td>
                          {Array.isArray(dato.archivo) && dato.archivo.length > 0 ? (
                            <ul>
                              {dato.archivo.map((archivo, idx) => (
                                <li key={idx}>{archivo.ruta}</li>
                              ))}
                            </ul>
                          ) : (
                            "archivodefault"
                          )}
                        </td>
                      </>
                    )}
                    {rolUser === "agente" ? (
                      <td>
                        {dato.external_id && (
                          <Link href={`editar/${dato.external_id}`} passHref>
                            <button
                              className="btn btn-warning"
                              style={{ backgroundColor: "#f39c12", color: "#fff" }}
                            >
                              Editar
                            </button>
                          </Link>
                        )}
                      </td>
                    ) : (
                      <>
                        <td>
                          {dato.external_id && (
                            <Link href={`archivos/${dato.external_id}`} passHref>
                              <button className="btn btn-info">Añadir archivo</button>
                            </Link>
                          )}
                        </td>
                        <td>
                          {dato.external_id && (
                            <Link href={`editardoc/${dato.external_id}`} passHref>
                              <button
                                className="btn btn-warning"
                                style={{ backgroundColor: "#f39c12", color: "#fff" }}
                              >
                                Editar
                              </button>
                            </Link>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No se encontraron datos.</p>
          )}
        </div>
      </div>
    </div>
  );
}
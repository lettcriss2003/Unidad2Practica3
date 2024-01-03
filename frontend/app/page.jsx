"use client";
import React, { useEffect, useState } from "react";
import { borrarSesion } from "@/hooks/SessionUtilClient";
import { simple_obtener, enviar, obtenerRecursos } from '@/hooks/Conexion';
import Menu from "@/componentes/menu";


export default function Home() {

  borrarSesion();
  return (
    <div className="container">
      <header>
        <Menu />
      </header>
      
      <div className="container mt-3">
        <p className="h1">DOCUMENTOS</p>
        <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="https://cdn.pixabay.com/photo/2014/01/29/20/28/architect-254579_1280.jpg"
                className="d-block w-100"
                alt="Imagen Firma Electrónica"
              />
            </div>
            <div className="carousel-item ">
              <img
                src="https://www.anahuac.mx/generacion-anahuac/sites/default/files/articles/GA_16.png"
                className="d-block w-100"
                alt="Imagen Firma Electrónica"
              />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

    </div>
  );

}
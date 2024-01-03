'use client';
import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { format } from 'date-fns';
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { simple_obtener, enviarRecursos, obtenerRecursos } from '@/hooks/Conexion';

import { estaSesion, getToken, obtenerExternalUser } from '@/hooks/SessionUtil';
import { useRouter } from 'next/navigation';
import Menusesion from '@/componentes/menu_sesion';
export default function Page() {
    const validationSchema = Yup.object().shape({
        tipo_documento: Yup.string().required('Seleccione el tipo de documento').oneOf(['LIBRO', 'AUDIOLIBRO'], 'Tipo de documento no válido'),
        autor: Yup.string().required('Ingrese el autor'),
        sinopsis: Yup.string().required('Ingrese la sinopsis'),
        genero: Yup.string().required('Ingrese el genero'),
        precio: Yup.number().positive().required('Ingrese el precio'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, setValue, watch, handleSubmit, formState } = useForm(formOptions);
    const router = useRouter();
    const { errors } = formState;
    const [documentos, setDocumentos] = useState([]);
    const TOKEN = getToken();



    const onSubmit = async (data) => {
        const externalUsuario = obtenerExternalUser();

        const newData = {
            "tipo_documento": data.tipo_documento,
            "autor": data.autor,
            "sinopsis": data.sinopsis,
            "genero": data.genero,
            "precio": data.precio,
            "persona": externalUsuario,
        };


        if (estaSesion) {
            const resultado = await enviarRecursos('gerente/documentos/save', newData, TOKEN);
            console.log(resultado);
            router.push('/principal');
        }

    };
    ;

    return (
        <div className="container">
            <header>
                <Menusesion></Menusesion>
            </header>
            <div className="container" style={{ backgroundColor: '#3498db', borderRadius: '8px', padding: '20px', marginTop: '10em', maxWidth: '600px', margin: 'auto', marginBottom: '9em' }}>
                <h2 className="text-center text-white">Nuevo Documento</h2>
                <form className="user" style={{ marginTop: '20px' }} onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="col-lg-6 mb-4">
                            <div className="form-outline">
                                <label className="form-label">Tipo de Documento</label>
                                <select {...register('tipo_documento')} name="tipo_documento" id="tipo_documento" className={`form-control ${errors.tipo_documento ? 'is-invalid' : ''}`}>
                                    <option value="">Seleccione el tipo de documento</option>
                                    <option value="LIBRO">Libro</option>
                                    <option value="AUDIOLIBRO">Audiolibro</option>
                                </select>
                                <div className='alert alert-danger invalid-feedback'>{errors.tipo_documento?.message}</div>
                            </div>

                            <div className="form-outline">
                                <label className="form-label">autor</label>
                                <input {...register('autor')} name="autor" id="autor" className={`form-control ${errors.autor ? 'is-invalid' : ''}`} />
                                <div className='alert alert-danger invalid-feedback'>{errors.autor?.message}</div>
                            </div>
                            <div className="form-outline">
                                <label className="form-label">sinopsis</label>
                                <input {...register('sinopsis')} name="sinopsis" id="sinopsis" className={`form-control ${errors.sinopsis ? 'is-invalid' : ''}`} />
                                <div className='alert alert-danger invalid-feedback'>{errors.sinopsis?.message}</div>
                            </div>
                        </div>
                        <div className="col-lg-6 mb-4">
                            <div className="form-outline">
                                <label className="form-label">genero</label>
                                <input {...register('genero')} name="genero" id="genero" className={`form-control ${errors.genero ? 'is-invalid' : ''}`} />
                                <div className='alert alert-danger invalid-feedback'>{errors.genero?.message}</div>
                            </div>


                            <div className="form-outline">
                                <label className="form-label">precio</label>
                                <input {...register('precio')} name="precio" id="precio" className={`form-control ${errors.precio ? 'is-invalid' : ''}`} />
                                <div className='alert alert-danger invalid-feedback'>{errors.precio?.message}</div>
                            </div>


                        </div>


                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '30px' }}>
                                <a href="/principal" className="btn btn-danger btn-rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                    <span style={{ marginLeft: '5px' }}>Cancelar</span>
                                </a>
                                <input className="btn btn-success btn-rounded" type='submit' value='Registrar'></input>
                            </div>
                        </div>
                    </div>
                </form>
                <hr />
            </div>
        </div>
    );
}
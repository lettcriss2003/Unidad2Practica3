'use client';
import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { obtenerRecursos, simple_obtener, enviarRecursos, enviarArchivos } from '@/hooks/Conexion';
import mensajes from '@/componentes/Mensajes';
import { getToken, obtenerExternalUser } from '@/hooks/SessionUtil';
import { useRouter } from 'next/navigation';
import Menusesion from '@/componentes/menu_sesion';
import { estaSesion } from '@/hooks/SessionUtilClient';
import FormData from 'form-data';

import { format } from 'date-fns';

export default function Page({ params }) {
    const { id } = params;

    const [documentos, setDocumentos] = useState([]);
    const [validationSchema, setValidationSchema] = useState(null);
    const [existingArchivos, setExistingArchivos] = useState([]);
    const router = useRouter();
    useEffect(() => {
        const obtenerDocumentos = async () => {
            try {
                const token = getToken();
                const response = await obtenerRecursos(`gerente/documentos/obtener/${id}`, token);
                const resultado = response.datos.tipo_documento;
                const archivos = response.datos.archivo;

                const newData = {};
                if (resultado === 'LIBRO') {
                    if (archivos.length > 2) {
                        mensajes('Ya están asociados el número máximo de archivos al documento', "error", "error");
                    }
                } else if (resultado === 'AUDIOLIBRO') {
                    if (archivos.length > 0) {
                        mensajes('Ya están asociados el número máximo de archivos al documento', "error", "error");
                    }
                }
                console.log(response.datos.archivo);
                setDocumentos(resultado);
                setExistingArchivos(archivos);

                const schema = Yup.object().shape({
                    fecha: Yup.date().required('Ingrese la fecha'),
                    total: Yup.number().positive().required('Ingrese el total'),
                    subtotal: Yup.number().positive().required('Ingrese el subtotal'),
                    nombre_cliente: Yup.string().required('Ingrese el nombre del cliente'),
                    celular_cliente: Yup.string().required('Ingrese el celular del cliente'),
                    external_document: Yup.string().required('Seleccione el tipo de documento'),
                    ...(resultado === 'LIBRO' && {
                        archivo1: archivos.length < 3 ? Yup.mixed().required('Seleccione el Archivo 1') : Yup.mixed(),
                        archivo2: archivos.length < 3 ? Yup.mixed().required('Seleccione el Archivo 2') : Yup.mixed(),
                        archivo3: archivos.length < 3 ? Yup.mixed().required('Seleccione el Archivo 3') : Yup.mixed(),
                    }),
                    ...(resultado === 'AUDIOLIBRO' && {
                        archivo: archivos.length < 1 ? Yup.mixed().required('Seleccione el Archivo') : Yup.mixed(),
                    }),
                });

                setValidationSchema(schema);

            } catch (error) {
                console.error('Error:', error);
            }
        };

        obtenerDocumentos();
    }, [id]);

    const onSubmit = async (data) => {
        console.log("si entra aqui");
        const externalUsuario = obtenerExternalUser();
        const token = getToken();

        const formData = new FormData();

        if (documentos === 'LIBRO') {
            if (data.archivo1 && data.archivo1.length > 0) {
                console.log("Archivo1", data.archivo1[0]);
                formData.set("Archivo1", data.archivo1[0]);
            }

            if (data.archivo2 && data.archivo2.length > 0) {
                console.log("Archivo2", data.archivo2[0]);
                formData.set("Archivo2", data.archivo2[0]);
            }

            if (data.archivo3 && data.archivo3.length > 0) {
                console.log("Archivo3", data.archivo3[0]);
                formData.set("Archivo3", data.archivo3[0]);
            }
        } else if (documentos === 'AUDIOLIBRO') {
            if (data.archivo && data.archivo.length > 0) {
                console.log("Archivo", data.archivo[0]);
                formData.set("Archivo", data.archivo[0]);
            }
        }
        if (estaSesion()) {
            console.log(formData);
            const resultado = await fetch(`http://localhost:3000/api/gerente/documentos/save/archivo/${id}`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        'news-token': token, 
                    },
                })

            console.log(resultado);
            mensajes('Archivos guardados con exito', "Operacion exitosa", "success");
            router.push('/principal');
        }
    };
    //const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, setValue, watch, handleSubmit, formState } = useForm(/*formOptions*/);

    //const { errors } = formState;
        return (
            <div className="container">
                <header>
                    <Menusesion></Menusesion>
                </header>
                <div className="container" style={{ backgroundColor: '#3498db', borderRadius: '8px', padding: '20px', marginTop: '10em', maxWidth: '600px', margin: 'auto', marginBottom: '9em' }}>
                    <h2 className="text-center text-white">Añadir Archivos</h2>
                    <form className="user" style={{ marginTop: '20px' }} onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            <div className="col-lg-6 mb-4">
                                {documentos === 'LIBRO' && Array.isArray(existingArchivos) && existingArchivos.length < 3 && (
                                    <>
                                        {existingArchivos.length < 1 && (
                                            <div className="form-outline">
                                                <label className="form-label">Archivo 1 (JPG, PNG)</label>
                                                <input {...register('archivo1')} type="file" accept=".jpg, .jpeg, .png" />
                                            </div>
                                        )}
                                        {existingArchivos.length < 2 && (
                                            <div className="form-outline">
                                                <label className="form-label">Archivo 2 (JPG, PNG)</label>
                                                <input {...register('archivo2')} type="file" accept=".jpg, .jpeg, .png" />
                                            </div>
                                        )}
                                        {existingArchivos.length < 3 && (
                                            <div className="form-outline">
                                                <label className="form-label">Archivo 3 (JPG, PNG)</label>
                                                <input {...register('archivo3')} type="file" accept=".jpg, .jpeg, .png" />
                                            </div>
                                        )}
                                    </>
                                )}
        
                                {documentos === 'AUDIOLIBRO' && Array.isArray(existingArchivos) && existingArchivos.length < 1 && (
                                    <div className="form-outline">
                                        <label className="form-label">Archivo (MP3, OGG)</label>
                                        <input {...register('archivo')} type="file" accept=".mp3, .ogg" />
                                    </div>
                                )}
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
                                    <input
                                        className="btn btn-success btn-rounded"
                                        type="submit"
                                        value="Registrar"
                                        disabled={existingArchivos.length >= (documentos === 'LIBRO' ? 3 : 1)}
                                    ></input>
                                </div>
                            </div>
                        </div>
                    </form>
                    <hr />
                </div>
            </div>
        );
}
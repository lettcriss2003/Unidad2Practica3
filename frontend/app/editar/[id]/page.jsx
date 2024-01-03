'use client';
import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { obtenerRecursos, simple_obtener, enviarRecursos } from '@/hooks/Conexion';
import mensajes from '@/componentes/Mensajes';
import { getToken, obtenerExternalUser } from '@/hooks/SessionUtil';
import { useRouter } from 'next/navigation';
import Menusesion from '@/componentes/menu_sesion';
import { estaSesion } from '@/hooks/SessionUtilClient';
import { format } from 'date-fns';

export default function Page({ params }) {
    const { id } = params;
    const validationSchema = Yup.object().shape({
        fecha: Yup.date().required('Ingrese la fecha'),
        total: Yup.number().positive().required('Ingrese el total'),
        subtotal: Yup.number().positive().required('Ingrese el subtotal'),
        nombre_cliente: Yup.string().required('Ingrese el nombre del cliente'),
        celular_cliente: Yup.string().required('Ingrese el celular del cliente'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, setValue, watch, handleSubmit, formState } = useForm(formOptions);
    const router = useRouter();
    const { errors } = formState;
    const [documentos, setDocumentos] = useState([]);
    const TOKEN = getToken();


    useEffect(() => {
        const obtenerDocumentos = async () => {
            try {
                const token = getToken();
                const response = await obtenerRecursos('/gerente/documentos', token);
                const resultado = response.datos;
                setDocumentos(resultado)
            } catch (error) {
                console.error('Error:', error);
            }
        };

        obtenerDocumentos();
    }, []);

    const onSubmit = async (data) => {
        const fechaFormateada = format(new Date(data.fecha), 'yyyy-MM-dd');
        const externalUsuario = obtenerExternalUser();

        const newData = {
            "fecha": fechaFormateada,
            "subtotal": data.subtotal,
            "total": data.total,
            "nombre_cliente": data.nombre_cliente,
            "celular_cliente": data.celular_cliente,
            "persona": externalUsuario,
            "documento": data.external_document,
        };


        if (estaSesion) {
            const resultado = await enviarRecursos(`agente/ventas/modificar/${id}`, newData, TOKEN);
            console.log(resultado);
            router.push('/principal');
        }

    };

    useEffect(() => {
        const selectedDocument = documentos.find(doc => doc.external_id === watch('external_document'));
        if (selectedDocument) {
            setValue('subtotal', selectedDocument.precio);
        }
    }, [watch('external_document')]);

    const renderDocumentosOptions = () => (
        <>
            <option value="">Elija un documento</option>
            {Array.isArray(documentos) &&
                documentos.map((doc, i) => (
                    doc.estado == true && (
                        <option key={i} value={doc.external_id}>
                            {doc.autor}
                        </option>
                    )
                ))}
        </>
    );

    return (
        <div className="container">
            <header>
                <Menusesion></Menusesion>
            </header>
            <div className="container" style={{ backgroundColor: '#3498db', borderRadius: '8px', padding: '20px', marginTop: '10em', maxWidth: '600px', margin: 'auto', marginBottom: '9em' }}>
                <h2 className="text-center text-white">Editar Venta</h2>
                <form className="user" style={{ marginTop: '20px' }} onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="col-lg-6 mb-4">
                            <div className="form-outline">
                                <label className="form-label">fecha</label>
                                <input {...register('fecha')} name="fecha" id="fecha" className={`form-control ${errors.fecha ? 'is-invalid' : ''}`} />
                                <div className='alert alert-danger invalid-feedback'>{errors.fecha?.message}</div>
                            </div>

                            <div className="form-outline">
                                <label className="form-label">subtotal</label>
                                <input {...register('subtotal')} name="subtotal" id="subtotal" className={`form-control ${errors.subtotal ? 'is-invalid' : ''}`} />
                                <div className='alert alert-danger invalid-feedback'>{errors.subtotal?.message}</div>
                            </div>
                            <div className="form-outline">
                                <label className="form-label">Documentos</label>
                                <select className='form-control' {...register('external_document', { required: true })} onChange={(e) => setValue('external_document', e.target.value)}>
                                    {renderDocumentosOptions()}
                                </select>
                            </div>
                        </div>
                        <div className="col-lg-6 mb-4">
                        <div className="form-outline">
                                <label className="form-label">total</label>
                                <input {...register('total')} name="total" id="total" className={`form-control ${errors.total ? 'is-invalid' : ''}`} />
                                <div className='alert alert-danger invalid-feedback'>{errors.total?.message}</div>
                            </div>
                            

                            <div className="form-outline">
                                <label className="form-label">nombre_cliente</label>
                                <input {...register('nombre_cliente')} name="nombre_cliente" id="nombre_cliente" className={`form-control ${errors.nombre_cliente ? 'is-invalid' : ''}`} />
                                <div className='alert alert-danger invalid-feedback'>{errors.nombre_cliente?.message}</div>
                            </div>

                            <div className="form-outline">
                                <label className="form-label">celular_cliente</label>
                                <input {...register('celular_cliente')} name="celular_cliente" id="celular_cliente" className={`form-control ${errors.celular_cliente ? 'is-invalid' : ''}`} />
                                <div className='alert alert-danger invalid-feedback'>{errors.celular_cliente?.message}</div>
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
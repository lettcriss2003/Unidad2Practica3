'use strict';
var models = require('../models')
var formidable = require('formidable')
var fs = require('fs');

var persona = models.persona;
var rol = models.rol;
var cuenta = models.cuenta;
var venta = models.venta;
var documento = models.documento;
var archivo = models.archivo;
const uuid = require('uuid');
class DocumentoControl {

    async obtener(req, res) {
        const external = req.params.external;
        var lista = await documento.findOne({
            where: { external_id: external },
            include: [
                { model: models.persona, as: 'persona', attributes: ['apellidos', 'nombres'] },
                { model: models.archivo, as: 'archivo', attributes: ['ruta', 'external_id'] },
            ],
            attributes: ['tipo_documento', 'autor', 'sinopsis', 'genero', 'precio', 'estado', 'external_id']
        });
        if (lista == undefined || lista==null) {
            res.status(404);
            res.json({ msg: "No encontrado", code: 404, datos: {} });
        } else {
            res.status(200);
            res.json({ msg: "OK", code: 200, datos: lista });
        }
    }

    async listar(req, res) {
        var lista = await documento.findAll({
            include: [
                { model: models.persona, as: 'persona', attributes: ['apellidos', 'nombres'] },
                { model: models.archivo, as: 'archivo', attributes: ['ruta', 'external_id'] },
            ],
            attributes: ['tipo_documento', 'autor', 'sinopsis', 'genero', 'precio', 'estado', 'external_id']
        });
        res.status(200);
        res.json({ msg: "OK", code: 200, datos: lista });
    }


    async guardar(req, res) {
        if (req.body.hasOwnProperty('tipo_documento') &&
            req.body.hasOwnProperty('autor') &&
            req.body.hasOwnProperty('sinopsis') &&
            req.body.hasOwnProperty('genero') &&
            req.body.hasOwnProperty('persona') &&
            req.body.hasOwnProperty('precio')) {

            var uuid = require('uuid');

            var perA = await persona.findOne({
                where: { external_id: req.body.persona },
                include: [
                    { model: models.rol, as: 'rol', attributes: ['nombre'] },
                ],
            });

            if (perA == undefined || perA == null) {
                res.status(401);
                res.json({ msg: "ERROR", tag: "No se encuentra el gerente", code: 401 });
            } else {
                var data = {
                    tipo_documento: req.body.tipo_documento,
                    external_id: uuid.v4(),
                    autor: req.body.autor,
                    sinopsis: req.body.sinopsis,
                    genero: req.body.genero,
                    precio: req.body.precio,
                    id_persona: perA.id
                };
                console.log(data);
                if (perA.rol.nombre == 'gerente') {
                    var result = await documento.create(data);
                    if (result === null) {
                        res.status(401);
                        res.json({ msg: "ERROR", tag: "No se puede crear", code: 401 });
                    } else {

                        await perA.save();
                        res.status(200);
                        res.json({ msg: "OK", code: 200 });

                    }
                } else {
                    res.status(400);
                    res.json({ msg: "ERROR", tag: "la persona que esta ingresando el documento no es un gerente" })
                }

            }

        } else {
            res.status(400);
            res.json({ msg: "ERROR", tag: "Datos incorrectos", code: 400 });
        }
    }

    async modificar(req, res) {
        if (req.body.hasOwnProperty('tipo_documento') &&
            req.body.hasOwnProperty('autor') &&
            req.body.hasOwnProperty('sinopsis') &&
            req.body.hasOwnProperty('genero') &&
            req.body.hasOwnProperty('persona') &&
            req.body.hasOwnProperty('estado') &&
            req.body.hasOwnProperty('precio')) {
            const external = req.params.external;
            var uuid = require('uuid');

            const documentoA = await documento.findOne({ where: { external_id: external } });
                
            if (!documentoA) {
                res.status(404);
                return res.json({ msg: "ERROR", tag: "Registro no encontrado", code: 404 });
            }

            var perA = await persona.findOne({
                where: { external_id: req.body.persona },
                include: [
                    { model: models.rol, as: 'rol', attributes: ['nombre'] },
                ],
            });

            if (perA == undefined || perA == null) {
                res.status(401);
                res.json({ msg: "ERROR", tag: "No se encuentra el gerente", code: 401 });
            } else {
                var data = {
                    tipo_documento: req.body.tipo_documento,
                    external_id: uuid.v4(),
                    autor: req.body.autor,
                    sinopsis: req.body.sinopsis,
                    genero: req.body.genero,
                    precio: req.body.precio,
                    estado:req.body.estado,
                    id_persona: perA.id
                };
                console.log(data);
                if (perA.rol.nombre == 'gerente') {
                    var result = await documentoA.update(data);
                    if (result === null) {
                        res.status(401);
                        res.json({ msg: "ERROR", tag: "No se puede crear", code: 401 });
                    } else {
                        await perA.save();
                        res.status(200);
                        res.json({ msg: "OK", code: 200 });

                    }
                } else {
                    res.status(400);
                    res.json({ msg: "ERROR", tag: "la persona que esta ingresando el documento no es un gerente" })
                }

            }

        } else {
            res.status(400);
            res.json({ msg: "ERROR", tag: "Datos incorrectos", code: 400 });
        }
    }

    async guardarArchivos(req, res) {
        var uuid = require('uuid');
        const external = req.params.external;
        var docA = await documento.findOne({
            where: { external_id: external },
        });
    
        if (!docA) {
            res.status(404);
            res.json({
                msg: "ERROR",
                tag: "Documento no encontrado",
                code: 404
            });
            return;
        }
    
        const archivosEnlazados = await archivo.count({
            where: { id_documento: docA.id }
        });
    
        if (docA.tipo_documento === 'LIBRO' && archivosEnlazados >= 3) {
            res.status(400);
            res.json({
                msg: "ERROR",
                tag: "Se ha alcanzado el límite de archivos para un libro",
                code: 400
            });
            return;
        }
    
        var form = new formidable.IncomingForm(), files = [];
        form.on('file', function (field, file) {
            files.push(file);
        }).on('end', function () {
            console.log('OK');
        });
    
        form.parse(req, async function (err, fields) {
            let listado = files;
            const maxSize = 2 * 1024 * 1024;
            var numArchivos = 0;
    
            for (let index = 0; index < listado.length; index++) {
                var file = listado[index];
    
                var extension = file.originalFilename.split('.').pop().toLowerCase();
    
                console.log(file);
                if (docA.tipo_documento === 'LIBRO' && numArchivos < 3) {
                    if (file.size > maxSize || !['jpg', 'png'].includes(extension)) {
                        res.status(400);
                        res.json({
                            msg: "ERROR",
                            tag: "Formato o tamaño de archivo no válido",
                            code: 400
                        });
                        return;
                    } else {
                        const name = uuid.v4() + '.' + extension; 
                        console.log(extension);
                        var archivoData = {
                            ruta: name,
                            external_id: uuid.v4(),
                            id_documento: docA.id
                        };
                        await archivo.create(archivoData);
                        numArchivos++;
    
                        fs.rename(file.filepath, 'public/multimedia/' + name, async function (err) {
                            if (err) {
                                console.error('Error al renombrar el archivo:', err);
                            } else {
                                console.log('Archivo renombrado con éxito');
                            }
                        });
                    }
                } else if (docA.tipo_documento === 'AUDIOLIBRO' && numArchivos === 0) {
                    if (file.size > maxSize || !['ogg', 'mp3'].includes(extension)) {
                        res.status(400);
                        res.json({
                            msg: "ERROR",
                            tag: "Formato o tamaño de archivo no válido para audiolibro",
                            code: 400
                        });
                        return;
                    } else {
                        const archivosAudiolibro = await archivo.count({
                            where: { id_documento: docA.id }
                        });
    
                        if (archivosAudiolibro > 0) {
                            res.status(400);
                            res.json({
                                msg: "ERROR",
                                tag: "Ya existe un archivo para el audiolibro",
                                code: 400
                            });
                            return;
                        }
    
                        const name = uuid.v4() + '.' + extension;
                        console.log(extension);
                        var archivoData = {
                            ruta: name,
                            external_id: uuid.v4(),
                            id_documento: docA.id
                        };
                        await archivo.create(archivoData);
                        numArchivos++;
    
                        fs.rename(file.filepath, 'public/multimedia/' + name, async function (err) {
                            if (err) {
                                console.error('Error al renombrar el archivo:', err);
                            } else {
                                console.log('Archivo renombrado con éxito');
                            }
                        });
                    }
                } else {
                    console.log('Condición no cumplida para cargar el archivo');
                }
            }
    
            res.status(200);
            res.json({ msg: "OK", code: 200 });
        });
    }
}
module.exports = DocumentoControl;

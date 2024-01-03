'use strict';
var models = require('../models')
var formidable = require('formidable')
var fs = require('fs');

var persona = models.persona;
var rol = models.rol;
var cuenta = models.cuenta;
var venta = models.venta;
class VentaControl {


    async obtener(req, res) {
        const external = req.params.external;
        var lista = await venta.findOne({
            where: { external_id: external },
            include: [
                { model: models.persona, as: 'persona', attributes: ['apellidos', 'nombres'] },
                { model: models.documento, as: 'documento', attributes: ['tipo_documento', 'autor','precio'] },
            ],
            attributes: ['fecha','subtotal', 'total', 'nombre_cliente', 'celular_cliente', 'external_id']
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
        var lista = await venta.findAll({
            include: [
                { model: models.persona, as: 'persona', attributes: ['apellidos', 'nombres'] },
                { model: models.documento, as: 'documento', attributes: ['tipo_documento', 'autor','precio'] },
            ],
            attributes: ['fecha','subtotal', 'total', 'nombre_cliente', 'celular_cliente', 'external_id']
        });
        res.status(200);
        res.json({ msg: "OK", code: 200, datos: lista });
    }

    async guardar(req, res) {
        if (req.body.hasOwnProperty('fecha') &&
            req.body.hasOwnProperty('subtotal') &&
            req.body.hasOwnProperty('total') &&
            req.body.hasOwnProperty('nombre_cliente') &&
            req.body.hasOwnProperty('celular_cliente') &&
            req.body.hasOwnProperty('persona') &&
            req.body.hasOwnProperty('documento')) {

            var uuid = require('uuid');

            var docA = await models.documento.findOne({
                where: { external_id: req.body.documento },
                include: [
                    { model: models.archivo, as: 'archivo',attributes: ['ruta'] },
                ],
            });

            var perA = await persona.findOne({
                where: { external_id: req.body.persona },
                include: [
                    { model: models.rol, as: 'rol', attributes: ['nombre'] },
                ],
            });

            if (perA == undefined || perA == null) {
                res.status(401);
                res.json({ msg: "ERROR", tag: "No se encuentra el agente", code: 401 });
            } else if(docA == undefined || docA == null){
                res.status(401);
                res.json({ msg: "ERROR", tag: "No se encuentra el documento", code: 401 });
            }else {
                if(docA.estado==false){
                    res.status(401);
                    res.json({ msg: "ERROR", tag: "el documento ya ha sido vendido" })
                }else{
                    var data = {
                        fecha: req.body.fecha,
                        external_id: uuid.v4(),
                        subtotal: req.body.subtotal,
                        total: req.body.total,
                        nombre_cliente: req.body.nombre_cliente,
                        celular_cliente: req.body.celular_cliente,
                        id_persona: perA.id,
                        id_documento: docA.id
                    };
                    var dataDoc = {
                        estado: false,
                    };
                    console.log(data);
                    if (perA.rol.nombre == 'agente') {
                        var result = await venta.create(data);
                        await docA.update(dataDoc);
                        if (result === null) {
                            res.status(401);
                            res.json({ msg: "ERROR", tag: "No se puede crear", code: 401 });
                        } else {
                            docA.external_id = uuid.v4();
                            await docA.save();
                            res.status(200);
                            res.json({ msg: "OK", code: 200 });
                        }
    
                    } else {
                        res.status(400);
                        res.json({ msg: "ERROR", tag: "la persona que esta ingresando al docuemento no es un agente" })
                    }
    
                }
            }

        } else {
            res.status(400);
            res.json({ msg: "ERROR", tag: "Datos incorrectos", code: 400 });
        }
    }


    async modificar(req, res) {

        if (req.body.hasOwnProperty('fecha') &&
            req.body.hasOwnProperty('subtotal') &&
            req.body.hasOwnProperty('total') &&
            req.body.hasOwnProperty('nombre_cliente') &&
            req.body.hasOwnProperty('celular_cliente') &&
            req.body.hasOwnProperty('persona') &&
            req.body.hasOwnProperty('documento')) {
            
            const external = req.params.external;


            var uuid = require('uuid');

            const ventaA = await venta.findOne({ where: { external_id: external } });
    
            if (!ventaA) {
                res.status(404);
                return res.json({ msg: "ERROR", tag: "Registro no encontrado", code: 404 });
            }
            var docA = await models.documento.findOne({
                where: { external_id: req.body.documento },
                include: [
                    { model: models.archivo, as: 'archivo',attributes: ['ruta'] },
                ],
            });

            var perA = await persona.findOne({
                where: { external_id: req.body.persona },
                include: [
                    { model: models.rol, as: 'rol', attributes: ['nombre'] },
                ],
            });

            if (perA == undefined || perA == null) {
                res.status(401);
                res.json({ msg: "ERROR", tag: "No se encuentra el agente", code: 401 });
            } else if(docA == undefined || docA == null){
                res.status(401);
                res.json({ msg: "ERROR", tag: "No se encuentra el documento", code: 401 });
            }else {
                    var data = {
                        fecha: req.body.fecha,
                        external_id: uuid.v4(),
                        subtotal: req.body.subtotal,
                        total: req.body.total,
                        nombre_cliente: req.body.nombre_cliente,
                        celular_cliente: req.body.celular_cliente,
                        id_persona: perA.id,
                        id_documento: docA.id
                    };
                    var dataDoc = {
                        estado: false,
                    };
                    console.log(data);
                    if (perA.rol.nombre == 'agente') {
                        var result = await ventaA.update(data);
                        await docA.update(dataDoc);
                        if (result === null) {
                            res.status(401);
                            res.json({ msg: "ERROR", tag: "No se puede crear", code: 401 });
                        } else {
                            docA.external_id = uuid.v4();
                            await docA.save();
                            res.status(200);
                            res.json({ msg: "OK", code: 200 });
                        }
    
                    } else {
                        res.status(400);
                        res.json({ msg: "ERROR", tag: "la persona que esta ingresando a la noticia no es un agente" })
                    }
    
            }

        } else {
            res.status(400);
            res.json({ msg: "ERROR", tag: "Datos incorrectos", code: 400 });
        }
    }
}
module.exports = VentaControl;

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
class ArchivoControl {

    async listar(req, res) {
        var lista = await archivo.findAll({
            include: [
                { model: models.documento, as: 'documento', attributes: ['autor', 'tipo_documento'] },
            ],
            attributes: ['ruta','external_id']
        });
        res.status(200);
        res.json({ msg: "OK", code: 200, datos: lista });
    }
}
module.exports = ArchivoControl;

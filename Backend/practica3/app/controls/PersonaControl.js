'use strict';
var models = require('../models')
var persona = models.persona;
var rol = models.rol;
var cuenta = models.cuenta;
class PersonaControl {

    async obtener(req, res) {
        const external = req.params.external;
        var lista = await persona.findOne({
            where: { external_id: external },
            include: [
                { model: models.cuenta, as: 'cuenta', attributes: ['usuario'] },
                { model: models.rol, as: 'rol', attributes: ['nombre'] },
                { model: models.venta, as: 'venta', attributes: ['fecha','subtotal', 'total', 'nombre_cliente', 'celular_cliente', 'external_id'] }
            ],
            attributes: ['nombres', 'apellidos', 'direccion', 'ciudad', 'id_rol', 'external_id']
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
        var lista = await persona.findAll({
            include: [
                { model: models.cuenta, as: 'cuenta', attributes: ['usuario'] },
                { model: models.rol, as: 'rol', attributes: ['nombre'] },
                { model: models.venta, as: 'venta', attributes: ['fecha','subtotal', 'total', 'nombre_cliente', 'celular_cliente', 'external_id'] }
            ],
            attributes: ['nombres', 'apellidos', 'direccion', 'ciudad', 'id_rol', 'external_id']
        });
        res.status(200);
        res.json({ msg: "OK", code: 200, datos: lista });
    }

    async guardar(req, res) {
        if (req.body.hasOwnProperty('nombres') &&
            req.body.hasOwnProperty('apellidos') &&
            req.body.hasOwnProperty('ciudad') &&
            req.body.hasOwnProperty('direccion') &&
            req.body.hasOwnProperty('usuario') &&
            req.body.hasOwnProperty('clave') &&
            req.body.hasOwnProperty('rol')) {

            var uuid = require('uuid');
            var rolA = await rol.findOne({ where: { external_id: req.body.rol } });

            if (rolA != undefined) {
                var data = {
                    nombres: req.body.nombres,
                    apellidos: req.body.apellidos,
                    ciudad: req.body.ciudad,
                    direccion: req.body.direccion,
                    external_id: uuid.v4(),
                    id_rol: rolA.id,
                    cuenta: {
                        usuario: req.body.usuario,
                        clave: req.body.clave
                    }
                }

                let transaction = await models.sequelize.transaction();

                try {
                    var result = await persona.create(data, { include: [{ model: models.cuenta, as: "cuenta" }], transaction });
                    await rolA.save();
                    await transaction.commit();

                    if (result === null) {
                        res.status(401);
                        res.json({ msg: "ERROR", tag: "No se puede crear", code: 401 });
                    } else {
                        res.status(200);
                        res.json({ msg: "OK", code: 200 });
                    }
                } catch (error) {
                    if (transaction) await transaction.rollback();
                    res.status(203);
                    res.json({ msg: "ERROR", code: 203, error_msg: error });
                }
            } else {
                res.status(400);
                res.json({ msg: "ERROR", tag: "Dato no existente", code: 400 });
            }

        } else {
            res.status(400);
            res.json({ msg: "ERROR", tag: "Datos incorrectos", code: 400 });
        }
    }



}
module.exports = PersonaControl;
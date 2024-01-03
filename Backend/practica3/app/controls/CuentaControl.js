'use strict';
var models = require('../models')
var cuenta = models.cuenta;
let jwt =require('jsonwebtoken');


class CuentaControl {
    async listar(req, res) {
        var lista = await cuenta.findAll({
            attributes: ['usuario', 'clave','estado','external_id']
        });
        res.status(200);
        res.json({ msg: "OK", code: 200, datos: lista });
    }

    async inicio_sesion(req,res){
        if (req.body.hasOwnProperty('usuario') &&
            req.body.hasOwnProperty('clave')){
                let cuentaA = await cuenta.findOne({
                    where: { usuario: req.body.usuario },
                    include: [
                      {
                        model: models.persona,
                        as: 'persona',
                        attributes: ['apellidos', 'nombres', 'external_id'],
                        include: [
                          {
                            model: models.rol,
                            as: 'rol',
                            attributes: ['nombre'], 
                          },
                        ],
                      },
                    ],
                  });
                if (cuentaA==null){
                    res.status(400);
                    res.json({ msg: "ERROR",tag:"Cuenta no existente",code:400 });
                }else{
                    if(cuentaA.estado==true){
                        if(cuentaA.clave===req.body.clave){
                            const token_data={
                                external: cuentaA.external_id,
                                check:true
                            };
                            require('dotenv').config();
                            const key=process.env.KEY_SEC;
                            const token = jwt.sign(token_data,key,{
                                expiresIn:'2h'
                            });
                            var info={
                                token:token,
                                user: cuentaA.persona.apellidos+' '+ cuentaA.persona.nombres,
                                external_id:cuentaA.persona.external_id,
                                rol:cuentaA.persona.rol.nombre
                            };
                            res.status(200).json({ msg: 'OK', data: info,code:200});
                        }else{
                            res.status(400);
                            res.json({ msg: "ERROR",tag:"Clave o correo no existente",code:400 });
                        }
                    }else{
                        res.status(400);
                        res.json({ msg: "ERROR",tag:"Cuenta desactivada",code:400 });
                    }
                }
        }else{
            res.status(400);
            res.json({ msg: "ERROR",tag:"Faltan datos",code:400 });
        }
    }


}
module.exports = CuentaControl;
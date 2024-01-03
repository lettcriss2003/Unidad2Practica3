var express = require('express');
var router = express.Router();
let jwt =require('jsonwebtoken');
const personaC=require('../app/controls/PersonaControl')
let personaControl=new personaC();

const rolC=require('../app/controls/RolControl')
let rolControl=new rolC();

const cuentaC=require('../app/controls/CuentaControl')
let cuentaControl=new cuentaC();

const ventaC=require('../app/controls/VentaControl')
let ventaControl=new ventaC();


const documentoC=require('../app/controls/documentoControl')
let documentoControl=new documentoC();

const archivoC=require('../app/controls/ArchivoControl')
let archivoControl=new archivoC();

const auth=function middleware(req,res,next){
  
    const token =req.headers['news-token'];
    console.log('Token:', token);
    console.log(token);
    if(token===undefined){
      res.status(401);
      res.json({ msg: "Falta Token", code: 401 });
    }else{
      require('dotenv').config();
      const key=process.env.KEY_SEC;
      jwt.verify(token,key,async(err,decoded)=>{
        if(err){
          res.status(401);
          res.json({ msg: "ERROR",tag:'token no valido o expirado', code: 401 });
        }else{
          console.log(decoded.external);
          const models=require('../app/models');
          const cuenta=models.cuenta;
          const aux=await cuenta.findOne({
            where: {external_id:decoded.external}
         });
         if(aux===null){
          res.status(401);
          res.json({ msg: "ERROR",tag:'token no valido', code: 401 });
         }else{
          next();
        }
        }

      });
    }
}


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});




router.get('/admin/personas',personaControl.listar);
router.post('/admin/persona/save',personaControl.guardar);
router.get('/admin/persona/get/:external',personaControl.obtener);

router.get('/admin/roles',rolControl.listar);
router.post('/admin/rol/save',rolControl.guardar);

router.post('/usuario/inicio_sesion',cuentaControl.inicio_sesion);
router.get('/admin/cuentas',cuentaControl.listar);


router.get('/agente/ventas',ventaControl.listar);
router.post('/agente/ventas/save',ventaControl.guardar);
router.post('/agente/ventas/modificar/:external',ventaControl.modificar);
router.get('/agente/ventas/obtener/:external',ventaControl.obtener);

router.get('/gerente/documentos',documentoControl.listar);
router.post('/gerente/documentos/save',documentoControl.guardar);
router.post('/gerente/documentos/save/archivo/:external',documentoControl.guardarArchivos);
router.post('/gerente/documentos/modificar/:external',documentoControl.modificar);
router.get('/gerente/documentos/obtener/:external',documentoControl.obtener);
router.get('/gerente/archivos',archivoControl.listar);


module.exports = router;

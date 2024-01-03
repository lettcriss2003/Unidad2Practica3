"use client";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { inicio_sesion } from '@/hooks/Autentication';
import { useRouter } from 'next/navigation'
import { estaSesion } from '@/hooks/SessionUtilClient';
import mensajes from '@/componentes/Mensajes';
import Menusesion from '@/componentes/menu_sesion';
import Menu from '@/componentes/menu';
export default function Inicio_sesion() {
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    usuario: Yup.string().required('Ingrese un usuario'),
    clave: Yup.string().required('Ingrese su clave')
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const sendData = (data) => {
    const credentials = { "usuario": data.usuario, "clave": data.clave };
    console.log(credentials);
  
    inicio_sesion(credentials)
      .then((response) => {
        console.log(response);
  
        if (estaSesion()) {
          mensajes("Has ingresado al sistema!", "Bienvenido", "success");
          router.push("/principal");
        } else {
          mensajes("Error al iniciar sesión!", "Algo salió mal", "error");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          mensajes("Error al iniciar sesión: Credenciales icorrectas", "La contraseña ingresada es incorrecta", "error");
        } else {
          mensajes("Error al iniciar sesión!", "Algo salió mal", "error");
        }
      });
  };


  return (
    <div className="container">
      <header>
        <Menu></Menu>

      </header>
      <div
        className="px-4 py-5 px-md-5 text-center text-lg-start"
        style={{ backgroundColor: "hsl(0, 0%, 96%)" }}
      >
        <div className="container">
          <div className="row gx-lg-5 align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <h1 className="my-5 display-3 fw-bold ls-tight">
                Inicio <br />
                <span className="text-primary">Sesión</span>
              </h1>
            </div>

            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="card">
                <div className="card-body py-5 px-md-5">
                  <form onSubmit={handleSubmit(sendData)}>
                    <div className="form-outline mb-4">
                      <input
                        {...register("usuario")}
                        type="usuario"
                        name="usuario"
                        id="usuario"
                        className={`form-control ${errors.usuario ? "is-invalid" : ""
                          }`}
                      />
                      <label className="form-label">Usuario</label>
                      <div className="alert alert-danger invalid-feedback">
                        {errors.usuario?.message}
                      </div>
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        {...register("clave")}
                        type="password"
                        name="clave"
                        id="clave"
                        className={`form-control ${errors.clave ? "is-invalid" : ""
                          }`}
                      />
                      <label className="form-label">Clave</label>
                      <div className="alert alert-danger invalid-feedback">
                        {errors.clave?.message}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-block mb-4"
                    >
                      Ok
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

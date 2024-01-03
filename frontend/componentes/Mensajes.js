import swal from "sweetalert";

const mensajes = (titulo, texto, tipo = "success") =>
  swal(titulo, texto,tipo, {
    button: "Aceptar",
    timer: 3000,
    closeOnEsc: true,
  });

export default mensajes;

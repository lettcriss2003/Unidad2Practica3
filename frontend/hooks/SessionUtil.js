export const save = (key, data) => {
    sessionStorage.setItem(key, data);
  };
  
  export const get = (key) => {
    sessionStorage.setItem(key, data);
  };
  
  export const saveToken = (key) => {
    sessionStorage.setItem("token", key);
  };
  export const getToken = () => {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem("token");
    } else {
      console.error("Error: sessionStorage no está disponible en este entorno.");
      return null;
    }
  };
  
  export const borrarSesion = () => {
    sessionStorage.clear();
  };
  
  export const estaSesion = () => {
    return token && (token != "undefined" || token != null || token != "null");
  };

  export const obtenerExternalUser=()=>{
    return sessionStorage.getItem("external_id");
  };

  export const obtenerRolUser = () => {

    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem("rol");
    } else {
      console.error("Error: sessionStorage no está disponible en este entorno.");
      return null;
    }
  };
  
  export const getUserId = () => {
    sessionStorage.get('id');
  };

  
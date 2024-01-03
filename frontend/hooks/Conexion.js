let URL = "http://localhost:3000/api/";
import axios from 'axios';

export function url_api() {
  return URL;
}

export async function simple_obtener(recurso) {
  const response = await fetch(URL + recurso);
  return await response.json();
}


export async function obtenerRecursos(recurso,token){
  const headers = {
    Accept: "application/json",
    "content-type":"application/json",
    "news-token": token,
  };
  
  const response = await fetch(URL + recurso, {
    method: "GET",
    headers: headers,
    cache:'no-store',
  });
  return await response.json();
}





export async function enviar(recurso, data) {
  const headers = {
    "Accept": "application/json",
  };
  const urlCompleta = URL + recurso;
  try {
    const response = await axios.post(urlCompleta, data, { headers });
    return response.data;
  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
}


export async function enviarArchivos(recurso, data, key = '') {
  let headers = {};
  if (key !== '') {
    headers = {
      "Accept": "application/json",
      "news-token": key
    };
  } else {
    headers = {
      "Accept": "application/json",
    };
  }

  const formData = new FormData();

  
  for (const key in data) {
    formData.append(key, data[key]);
  }

  console.log("Solicitud al API:", {
    URL: URL + recurso,
    requestOptions: {
      method: "POST",
      headers: headers,
      data: formData,
    }
  });

  try {
    const response = await axios.post(URL + recurso, formData, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("Respuesta del API:", response.data);

    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error; 
  }
}

export async function enviarRecursos(recurso, data, key = '') {
  let headers = {};
  if (key !== '') {
      headers = {
          "Accept": "application/json",
          "news-token": key,
          "Content-Type": "application/json", 
      };
  } else {
      headers = {
          "Accept": "application/json",
          "Content-Type": "application/json",
      };
  }

  console.log("Solicitud al API:", {
      URL: URL + recurso,
      requestOptions: {
          method: "POST",
          headers: headers,
          data: JSON.stringify(data),
      }
  });

  try {
      const response = await axios.post(URL + recurso, data, { headers });
      console.log("Respuesta del API:", response.data);
      return response.data;
  } catch (error) {
      console.error('Error en la solicitud:', error);
      throw error;
  }
}
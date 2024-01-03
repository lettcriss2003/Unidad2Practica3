"use client";
export const get = (key) => {
  window.sessionStorage.getItem(key);
};

export const getToken = () => {
  return window.sessionStorage.getItem("token");
};

export function borrarSesion() {
  window.sessionStorage.clear();
}

export function estaSesion() {
  let token = window.sessionStorage.getItem("token");

  return token && (token != "undefined" || token != null || token != "null");
}

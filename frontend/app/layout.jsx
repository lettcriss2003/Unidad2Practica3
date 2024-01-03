import { Inter } from "next/font/google";
//import './globals.css'

import "bootstrap/dist/css/bootstrap.css";
import Principal from "./principal/page";
import Footer from "@/componentes/footer";
import Menu from "@/componentes/menu";

const inter = Inter({ subsets: ["latin"] });

// children es para los fragmentos de pagina se cargan automaticamente es el hueco 
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Documentos</title>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js" />
      </head>
      <body className={inter.className}>
        <div className="container-fluid">

          <section className="container">{children}
          </section>
          <Footer/>
          
        </div>
      </body>
    </html>
  );
}
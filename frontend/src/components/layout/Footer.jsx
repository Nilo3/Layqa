import { FaWhatsapp, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer class="pie">
      <div class="grupo1">
        
        <div class="box">
          <h2>SOBRE NOSOTROS</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, iusto.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, iusto.</p>
        </div>
        <div class="box">
          <h2>CONTACTO</h2>
          <div class="redsocial">
            <a href="#" class=""><FaInstagram /></a>
            <a href="#" class=""><FaWhatsapp /></a>
          </div>
        </div>
      </div>
      <div class="grupo2">
        <small>&copy; 2023 <b>Layqa</b> - Todos los Derechos Reservados.</small>
      </div>
    </footer>
  );
}

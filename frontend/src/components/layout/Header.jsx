import React, { Fragment } from "react";
import "../../App.css";
import { useDispatch, useSelector} from "react-redux"
import { useAlert } from "react-alert"
import { Link,  useNavigate } from "react-router-dom";
import { logout } from "../../actions/userActions";

const Header = () => {

  const navigate = useNavigate();

  const alert = useAlert();
  const dispatch = useDispatch();

  const { user, loading } = useSelector(state => state.auth)
  const { cartItems } = useSelector(state => state.cart)

  const logoutHandler = () => {
    dispatch(logout());
    alert.success('Logged out successfully.')
}


  return (
  <header>
    <Link to="/" className="logo">
  <img src="/images/layqa.png" alt="logolayqa" />
  </Link>
  <h2 class="text2">Layqa</h2>
   
  <div className="col-120  mt-4 mt-md-0 text-center">
        <Link to="/cart" style={{ textDecoration: "none "}}>
        <strong id="cart" >Carrito</strong>
          <span className="ml-1" id="cart_count">{cartItems.length}</span>
          </Link>

          {user ? (

            <div className="ml-4 dropdown d-inline" >
              <Link to="#!" className="btn dropdown-toggle mr-4"
              type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"
              aria-expanded="false">

                <figure className="avatar avatar-nav">
                  <img 
                    src={user.avatar && user.avatar.url} 
                    alt={user && user.name}
                    className="rounded-circle"
                  />
                  
                </figure>
                <strong>{user && user.name}</strong>
              </Link>
             
              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton1">

                {user && user.role !== "admin" ? (
                  <Link className="dropdown-item" to="/orders/me">Pedidos</Link>
                ) : (
                  <Link className="dropdown-item" to="/dashboard">Admin</Link>
                )}
                <Link className="dropdown-item" to="/me">Mi Perfil</Link>
                <Link className="dropdown-item text-danger" to="/" onClick={logoutHandler}>
                  Logout
                </Link>
              </div>
            </div>
            

          ): !loading  && <Link to="Login" className="btn ml-4" id="login_btn">Ingresar</Link> }
          
          

          
        </div>
  </header>
  )
};

export default Header;


































import React, { Fragment } from "react";
import "../../App.css";
import { useDispatch, useSelector} from "react-redux"
import { useAlert } from "react-alert"
import { NavLink, Link,   useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const alert = useAlert();
  const dispatch = useDispatch();

  const { user, loading } = useSelector(state => state.auth)



  return (
    <Fragment>
      <nav className="navbar row">
        <div className="col-12 col-md-3">
          <div className="navbar-brand">
            <img className="image" src="/images/layqa.jpg" alt="layqa" />
          </div>
        </div>

        <div className="col-12 col-md-6 mt-2 mt-md-0">
          
        </div>

        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
        <Link to="/cart" style={{ textDecoration: "none "}}>
        <span id="cart" className="ml-3">Carrito</span>
          <span className="ml-1" id="cart_count">2</span>
          </Link>

          {user ? (

            <div className="ml-4 dropdown d-inline" >
              <Link to="#!" className="btn btn-secondary dropdown-toggle"
              type="button" id="dropdownMenuButton" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">

                <figure className="avatar avatar-nav">
                  <img 
                    src={user.avatar && user.avatar.url} 
                    alt={user && user.name}
                    className="rounded-circle"
                  />
                  
                </figure>
                <span>{user && user.name}</span>
              </Link>
             
              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <Link className="dropdown-item text-danger" to="/">
                  Logout
                </Link>
              </div>
            </div>

          ): !loading  && <Link to="Login" className="btn ml-4" id="login_btn">Ingresar</Link> }
          
          

          
        </div>
      </nav>
    </Fragment>
  );
};

export default Header;

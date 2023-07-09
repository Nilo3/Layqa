import React, { Fragment } from "react";
import "../../App.css";
import Search from "./Search";
import { Route, Routes, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const searchHandler = (keyword) => {
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  };

  return (
    <Fragment>
      <nav className="navbar row">
        <div className="col-12 col-md-3">
          <div className="navbar-brand">
            <img className="image" src="/images/layqa.jpg" alt="layqa" />
          </div>
        </div>

        <div className="col-12 col-md-6 mt-2 mt-md-0">
          <Routes>
            <Route
              path="/"
              element={<Search searchHandler={searchHandler} />}
            />
          </Routes>
        </div>

        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          <button className="btn" id="login_btn">
            Ingresar
          </button>

          <span id="cart" className="ml-3">
            Carrito
          </span>
          <span className="ml-1" id="cart_count">
            2
          </span>
        </div>
      </nav>
    </Fragment>
  );
};

export default Header;

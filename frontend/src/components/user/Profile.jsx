import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  // Load the user state from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  // Save the user state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const authState = useSelector((state) => state.auth);
  useEffect(() => {
    setUser(authState.user);
    setLoading(authState.loading);
  }, [authState]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Tu Perfil"} />
          <h2 className="mt-5 ml-5">Mi Perfil</h2>
          <div className="row justify-content-around mt-5 user-info">
            <div className="col-12 col-md-3">
              <figure className="avatar avatar-profile">
                <img className="rounded-circle img-fluid" src={user.avatar?.url} alt={user.name} />
              </figure>
              <Link to="/me/update" id="edit_profile" className="btn btn-primary btn-block my-5">
                Editar Mi Perfil
              </Link>
            </div>

            <div className="col-12 col-md-5">
              <h4>Nombre</h4>
              <p>{user.name}</p>

              <h4>Email</h4>
              <p>{user.email}</p>

              {user.role !== "admin" && (
                <Link to="/orders/me" id="edit_profile" className="btn btn-primary btn-block mt-5">
                  Mis Compras
                </Link>
              )}

              <Link to="/password/update" id="edit_profile" className="btn btn-primary btn-block mt-3">
                Cambiar mi contraseña
              </Link>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Profile;

import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";

const Profile = () => {
  const { user, loading } = useSelector((state) => state.auth);
  console.log(user);

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
                <img className="rounded-circle img-fluid" src={user.avatar.url} alt={user.name} />
              </figure>
              <Link
                to="/me/update"
                id="edit_profile"
                className="btn btn-primary btn-block my-5"
              >
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
                Cambiar mi password
              </Link>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Profile;

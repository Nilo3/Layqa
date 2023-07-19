import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layout/MetaData";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProfile,
  loadUser,
  clearErrors,
} from "../../actions/userActions";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "../../actions/userActions";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants";

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");


  const alert = useAlert();
  const dispatch = useDispatch();


  const { error, isUpdated, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {


    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Password actualizado correctamente");

      window.history.pushState(null, "", "/"); // Cambiar la URL sin navegación completa
      window.location.reload();
    }
  }, [dispatch, alert, error, isUpdated]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("oldPassword", oldPassword);
    formData.set("password", password);
   
    dispatch(updatePassword(formData));
  };

  return (
   <Fragment>
        <MetaData title={"Change Password"} />
        <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mt-2 mb-5">Cambiar Password</h1>
                        <div className="form-group">
                            <label for="old_password_field">Password Actual</label>
                            <input
                                type="password"
                                id="old_password_field"
                                className="form-control"
                                value={oldPassword}
                                onChange={(e)=> setOldPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label for="new_password_field">Nuevo Password</label>
                            <input
                                type="password"
                                id="new_password_field"
                                className="form-control"
                                value={password}
                                onChange={(e)=> setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn update-btn btn-block mt-4 mb-3"
                        disabled={loading ? true : false}>Cambiar Password</button>
                    </form>
                </div>
            </div>
  </Fragment>)
};


export default UpdatePassword;

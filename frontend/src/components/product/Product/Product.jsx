import React from "react";
import { Link } from "react-router-dom";
import style from "./Product.module.css";

const Product = ({ product }) => {
  return (
    <div className="col-sm-12 col-md-6 col-lg-4 my-3">
      <div className="card p-3 rounded">
        <img
          className={style.cardimgtop}
          src={product.images[0].url}
          alt={product.name}
        />
        <div className="card-body d-flex flex-column">
          <h5 className={style.cardtitle}>
            <Link to={`/products/${product._id}`}>{product.name}</Link>
          </h5>
          
          <p className="card-text">${product.price}</p>
          <Link
            to={`/products/${product._id}`}
            id="view_btn"
            className="btn btn-block"
          >
            Ver en detalle
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;

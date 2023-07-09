import React, { Fragment, useState, useEffect } from "react";
import MetaData from "./layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions";
import Product from "./product/Product";
import Loader from "./layout/Loader";
import { useAlert } from "react-alert";
import Pagination from "react-js-pagination";
import { useParams } from "react-router-dom";
import Search from "../components/layout/Search";

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const alert = useAlert();
  const { loading, products, error, productCount, resPerPage } = useSelector(
    (state) => state.products
  );

  const { keyword } = useParams();

  useEffect(() => {
    if (error) {
      return alert.error(error);
    }
    dispatch(getProducts(keyword, currentPage));
  }, [dispatch, alert, error, keyword, currentPage]);

  function setCurrentPageNo(pageNumber) {
    setCurrentPage(pageNumber);
  }

  return (
    <Fragment>
      <Search />
      <MetaData title={"Envuelve tu hogar en fragancia"} />

      

      <br />
      <br />
      <h1 id="products-heading">Nuestros Productos</h1>

      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <section id="products" className="container mt-5">
            <div className="row">
              {products &&
                products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
            </div>
          </section>

          {resPerPage <= productCount && (
            <div className="d-flex justify-content-center mt-5">
              {productCount !== undefined ? (
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resPerPage}
                  totalItemsCount={productCount}
                  onChange={setCurrentPageNo}
                  nextPageText={"Next"}
                  prevPageText={"Prev"}
                  firstPageText={"First"}
                  lastPageText={"Last"}
                  itemClass="page-item"
                  linkClass="page-link"
                />
              ) : (
                <Loader />
              )}
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;

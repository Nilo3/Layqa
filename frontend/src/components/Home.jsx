import React, { Fragment, useState, useEffect } from "react";
import MetaData from "./layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions";
import Product from "./product/Product/Product"
import Loader from "./layout/Loader";
import { useAlert } from "react-alert";
import Pagination from "react-js-pagination";
import { useParams } from "react-router-dom";


const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [prevKeyword, setPrevKeyword] = useState("");
  const [category, setCategory] = useState("Todo");
  const [searchKeyword, setSearchKeyword] = useState("");
  const categories = ["Todo", "Velas", "Mantecas", "Difusores", "Jabones", "Aromas"];
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

    const selectedCategory = category === "Todo" ? "" : category;
    

    // Actualiza el valor de keyword en base al estado searchKeyword
    const updatedKeyword = searchKeyword || keyword;
    
    dispatch(getProducts(updatedKeyword, currentPage, selectedCategory));
    setPrevKeyword(updatedKeyword);
  }, [dispatch, alert, error, searchKeyword, currentPage, category, keyword]);

  useEffect(() => {
    if (prevKeyword !== keyword) {
      setCurrentPage(1);
    }
  }, [keyword, prevKeyword]);

  function setCurrentPageNo(pageNumber) {
    setCurrentPage(pageNumber);
  }

  function handleCategoryChange(selectedCategory) {
    setCategory(selectedCategory);
    setCurrentPage(1);
    setSearchKeyword("");
  }



  return (
    <Fragment>
     <style>
        {`
       @import url('https://fonts.googleapis.com/css2?family=Lato:wght@700&display=swap');
      `}
      </style>
      <MetaData title={"Envuelve tu hogar en fragancia"} />

      <div className="container mt-5">
        <div className="row">
          <div className="col-md-3 mt-5">
            
          </div>
          <div className="col-md-20">
            <h1 id="products-heading" style={{ fontFamily: 'Lato' }} className="centrado">Nuestros Productos</h1>
                    <br />
            {loading ? (
              <Loader />
            ) : (
              <Fragment>
                <section id="products">
                  <div className="row">
                    {products &&
                      products.map((product) => (
                        <Product key={product._id} product={product} />
                      ))}
                  </div>
                </section>

                {resPerPage <= productCount && (
                  <div className="d-flex justify-content-center mt-5">
                    {productCount !== undefined && category === "Todo"  ? (
                      
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
                      <div />
                    )}
                  </div>
                )}
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;

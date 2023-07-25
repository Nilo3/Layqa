import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../../actions/cartActions";
import { useNavigate } from "react-router-dom";

const Cart = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const removeCartItemHandler = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const increaseQty = (id, quantity, stock) => {
    const newQty = quantity + 1;

    if (newQty >= stock) return;

    dispatch(addItemToCart(id, newQty));
  };

  const decreaseQty = (id, quantity) => {
    const newQty = quantity - 1;

    if (newQty <= 0) return;

    dispatch(addItemToCart(id, newQty));
  };

  const checkoutHandler = () => {
    navigate("/shipping")
  }

  return (
    <Fragment>
      <MetaData title={"Your Cart"} />
      {cartItems.length === 0 ? (
        <h2 className="mt-5">Tu Carrito esta vacio</h2>
      ) : (
        <Fragment>
          <h2 className="mt-5">
            Tu Compra: <b>{cartItems.length} producto</b>
          </h2>

          <div className="row d-flex justify-content-between">
            <div className="col-12 col-lg-8">
              {cartItems.map((item) => (
                <Fragment>
                  <hr />

                  <div className="cart-item" key={item.product}>
                    <div className="row">
                      <div className="col-4 col-lg-3">
                        <img
                          src={item.image}
                          alt="Laptop"
                          height="100"
                          width="90"
                        />
                      </div>

                      <div className="col-5 col-lg-3">
                        <Link to={`/products/${item.product}`}>
                          {item.name}
                        </Link>
                      </div>

                      <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                        <p id="card_item_price">${item.price}</p>
                      </div>

                      <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                        <div className="stockCounter d-inline">
                          <span
                            className="btn btn-dark minus"
                            onClick={() =>
                              decreaseQty(item.product, item.quantity)
                            }
                          >
                            -
                          </span>
                          <input
                            type="number"
                            className="form-control count d-inline"
                            value={item.quantity}
                            readOnly
                          />

                          <span
                            className="btn btn-dark plus"
                            onClick={() =>
                              increaseQty(
                                item.product,
                                item.quantity,
                                item.stock
                              )
                            }
                          >
                            +
                          </span>
                        </div>
                      </div>

                      <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                        <i
                          id="delete_cart_item"
                          className="fa fa-trash btn btn-danger"
                          onClick={() => removeCartItemHandler(item.product)}
                        ></i>
                      </div>
                    </div>
                  </div>
                  <hr />
                </Fragment>
              ))}
            </div>

            <div className="col-12 col-lg-3 my-4">
              <div id="order_summary">
                <h4>Detalle de la compra</h4>
                <hr />
                <p>
                  Subtotal:{" "}
                  <span className="order-summary-values">{cartItems.reduce((acc,item) => (acc + Number(item.quantity)), 0)} (Unidades)</span>
                </p>
                <p>
                  Total:{" "}
                  <span className="order-summary-values">$
                  {cartItems.reduce((acc,item) => acc +  item.quantity * item.price, 0).toFixed(2)}</span>
                </p>

                <hr />
                <button id="checkout_btn" className="btn btn-primary btn-block" onClick={checkoutHandler}>
                  Comprar
                </button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Cart;

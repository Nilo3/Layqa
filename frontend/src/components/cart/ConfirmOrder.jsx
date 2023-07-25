import React, { Fragment } from "react";
import MetaData from "../layout/MetaData";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import CheckoutSteps from "./CheckoutSteps";
import { useNavigate } from "react-router-dom";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react"
import { useState } from "react";
import axios from "axios"


const ConfirmOrder = () => {

  const [preferenceId, setPreferenceId] = useState(null)

  initMercadoPago("TEST-d60c80ed-9984-4b0d-99da-188ed1e71d8d")

  const createPreference = async () => {
    try {
      const response = await axios.post("http://localhost:8080/create_preference", {
        description: "item.name",
        price: totalPrice,
        quantity: 1,
       
      });

      const { id } = response.data
      return id;
    } catch (error) {
      console.log(error);
    }
  }


  const handleBuy = async () => {
    const id = await createPreference();
    if(id){
      setPreferenceId(id)
    }
  }


  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  // Calculate Order Prices
  const itemsPrice = cartItems.reduce((acc,item) => acc + item.price * item.quantity, 0)
  const shippingPrice = itemsPrice > 5000 ? 0 : 500
  const totalPrice = (itemsPrice + shippingPrice).toFixed(2)
  const navigate = useNavigate()


  const processToPayment = () => {
    const data = {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice,
        totalPrice
    }

    sessionStorage.setItem("orderInfo", JSON.stringify(data)) 
    navigate("/")
  }

  return (
    <Fragment>
      <MetaData title={"Confirm order"} />

      <CheckoutSteps shipping confirmOrder />

      <div className="row d-flex justify-content-between">
        <div className="col-12 col-lg-8 mt-5 order-confirm">
          <h4 className="mb-3">Informacion del envio</h4>
          <p>
            <b>Nombre: </b>
            {user && user.name}
          </p>
          <p>
            <b>Telefono: </b> {shippingInfo.phoneNo}
          </p>
          <p className="mb-4">
            <b>Dirección: </b>{" "}
            {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}
          </p>

          <hr />
          <h4 className="mt-4">Los productos que elegiste:</h4>

          {cartItems.map((item) => (
            <Fragment>
              <hr />
              <div className="cart-item my-1" key={item.product}>
                <div className="row">
                  <div className="col-4 col-lg-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      height="80"
                      width="70"
                    />
                  </div>

                  <div className="col-5 col-lg-6">
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </div>

                  <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                    <p>
                      {item.quantity} X ${item.price}<b> = ${item.quantity * item.price}</b>
                    </p>
                  </div>
                </div>
              </div>
              <hr />
            </Fragment>
          ))}
        </div>

        <div className="col-12 col-lg-4 my-4">
          <div id="order_summary">
            <h4>Detalle de compra</h4>
            <hr />
            <p>
              Subtotal: <span className="order-summary-values">${itemsPrice}</span>
            </p>
            <p>
              Envio : <span className="order-summary-values">${shippingPrice}</span>
            </p>
         

            <hr />

            <p>
              Total: <span className="order-summary-values">${totalPrice}</span>
            </p>

            <hr />
            <button id="checkout_btn" className="btn btn-primary btn-block" onClick={handleBuy}>
              Continuar para Pagar
            </button>
            {preferenceId && <Wallet initialization={{ preferenceId }} />}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;

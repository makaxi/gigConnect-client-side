import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import "./Orders.scss";

const Orders = () => {

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      newRequest.get(
        `/orders`)
        .then((res) => {
          return res.data
        }),
  });

  return (
    <div className="orders">
      {isLoading
        ? "Loading"
        : error
        ? "Something went wrong"
        : <div className="container">
          <div className="title">
            <h1>Orders</h1>
          </div>
          <table>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              {<th>{currentUser.isSeller ? "Buyer" : "Seller"}</th>}
              <th>Contact</th>
            </tr>

            {data.map((order) => (

              
              <tr key={order._id}>
                <td>
                  <img
                    className="image"
                    src={order.image}
                    alt=""
                  />
                </td>
                <td>{order.title}</td>
                <td>{order.price}</td>
                <td>
                  {/*TODO: {order.buyerId.name || order.sellerId.name} */}
                </td>
                <td>
                  <img className="message" src="./img/message.png" alt="" />
                </td>
              </tr>
            ))}



          </table>
        </div>
      }
    </div>
  );
};

export default Orders;

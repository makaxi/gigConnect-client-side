import React from "react";
import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  const handleContact = async (order)=>{
    const convoId = order.sellerId + order.buyerId;
    try{
      const convo = await newRequest.get(`/conversations/single/${convoId}`);
      navigate(`/message/${convoId}`);

    }catch(err){
      if(err.response.status === 404){
        const newConvo = await newRequest.post("/conversations/",
          {to : currentUser.isSeller? order.buyerId : order.sellerId}
        );
        navigate(`/message/${convoId}`);
      }
    }
  };
    
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
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>{currentUser.isSeller ? "Buyer" : "Seller"}</th>
                <th>Contact</th>
              </tr>
            </thead>

            <tbody>
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
                    {currentUser.isSeller ? order.buyerId : order.sellerId}
                  </td>
                  <td>
                    <img className="message" src="./img/message.png" alt="" onClick={()=>handleContact(order)}/>
                  </td>
                </tr>
            ))}
            </tbody>              
          </table>
        </div>
      }
    </div>
  );
};

export default Orders;

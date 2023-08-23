import React from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation} from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import "./Messages.scss";
import moment from "moment";

const Messages = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      newRequest.get(
        `/conversations`)
        .then((res) => {
          return res.data
        }),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.put(`/conversations/${id}`);
    },
    onSuccess:() => {
      queryClient.invalidateQueries(["conversations"])
    }
  });

  const handleRead = (id)=> {
    mutation.mutate(id);
  };
  
  return (
    <div className="messages">
      {isLoading
        ? "Loading..."
        : error
        ? "Something went wrong"
        : (
          <div className="container">
          <div className="title">
            <h1>Messages</h1>
          </div>
          <table>
            <thead>
              <tr>
                {/* <th>{currentUser.isSeller ? "Buyer" : "Seller"}</th> */}
                <th>Last Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
            {data.map(convo => (  
              <tr 
              className={ ((currentUser.isSeller && !convo.readBySeller) ||
                (!currentUser.isSeller && !convo.readByBuyer)) ?
                "active" : undefined}
                key={convo.id} >
                <td>{currentUser.isSeller ? convo.buyerId : convo.sellerId}</td>
                <td>
                  <Link to={`/message/${convo.id}`} className="link">
                    {convo?.lastMessage?.substring(0, 100)}...
                  </Link>
                </td>
                <td>{!convo.readByBuyer}</td>
                <td>{moment(convo.updatedAt).fromNow()}</td>
                <td>
                  {((currentUser.isSeller && !convo.readBySeller) ||
                  (!currentUser.isSeller && !convo.readByBuyer)) && (
                    <button onClick={()=>handleRead(convo.id)}>Mark as Read</button>
                    )}
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Messages;

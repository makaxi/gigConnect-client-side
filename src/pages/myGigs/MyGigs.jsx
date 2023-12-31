import React from "react";
import { Link } from "react-router-dom";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import "./MyGigs.scss";
import newRequest from "../../utils/newRequest";
import getCurrentUser from "../../utils/getCurrentUser";

function MyGigs() {
  const currentUser = getCurrentUser();
  console.log(currentUser);

  const queryClient = useQueryClient();

  const {isLoading, error, data} = useQuery({
    queryKey: ["myGigs"],
    queryFn: () =>
      newRequest.get(`/gigs?userId=${currentUser._id}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      newRequest.delete(`/gigs/${id}`)
    },
    onSuccess:() => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleDelete = (id) => {
    e.preventDefault();
    mutation.mutate(id); 
  }

  console.log(data);

  return (
    <div className="myGigs">
      {isLoading 
        ? "Loading" 
        : error 
        ? "Something went wrong"
        : <div className="container">
            <div className="title">
              <h1>Gigs</h1>
              {currentUser.isSeller && (
                <Link to="/add">
                  <button>Add New Gig</button>
                </Link>
              )}
            </div>
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Sales</th>
                  <th>Action</th>
                </tr>
              </thead>
              {data.map((gig) => (
                <tbody>
                  <tr key={gig._id}>
                    <td>
                      <img
                        className="image"
                        src={gig.cover}
                        alt=""
                      />
                    </td>
                    <td>{gig.title}</td>
                    <td>{gig.price}</td>
                    <td>{gig.sales}</td>
                    <td>
                      <img className="delete" src="./img/delete.png" alt="" onClick={()=>handleDelete(gig._id)}/>
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
        </div>
      }
    </div>
  );
}

export default MyGigs;
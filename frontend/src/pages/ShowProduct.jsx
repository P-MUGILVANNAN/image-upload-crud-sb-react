import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function ShowProduct() {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/products/${id}`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error("Error fetching product:", error));
  }, [id]);

  if (!product) return <h5 className="text-center mt-5">Loading...</h5>;

  return (
    <div className="container mt-5">
      <div className="row">
        <h5><i className="bi bi-pencil-square"></i> Product Details</h5>
        <nav className="my-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active">View Product</li>
          </ol>
        </nav>
        <div className="card">
          <img src={`http://localhost:8080/uploads/${product.imageUrl}`} alt={product.name} className="card-img-top" />
          <div className="card-body">
            <h5 className="card-title fw-bold">{product.name}</h5>
            <p className="card-text text-secondary">{product.description}</p>
            <p className="card-text fw-bold">MRP: <span className="text-danger text-decoration-line-through">{product.mrp}</span></p>
            <p className="card-text fw-bold">Selling Price: <span className="text-success">{product.price}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowProduct;

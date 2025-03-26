import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    mrp: "",
    price: "",
    description: "",
    image: null,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare form data for multipart upload
    const productData = new FormData();
    productData.append("name", formData.name);
    productData.append("mrp", formData.mrp);
    productData.append("price", formData.price);
    productData.append("description", formData.description);
    productData.append("image", formData.image);

    try {
      const response = await axios.post("http://localhost:8080/api/products", productData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product added successfully!");
      setFormData({ name: "", mrp: "", price: "", description: "", image: null }); // Reset form
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <h5>
          <i className="bi bi-plus-square-fill"></i> Add New Product
        </h5>
        <hr />
        <nav className="my-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item active">Add New Product</li>
          </ol>
        </nav>
        <div className="col-md-8">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-12">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" name="name" className="form-control" placeholder="Enter Product Name" value={formData.name} onChange={handleChange} required />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="mrp" className="form-label">MRP</label>
                <input type="text" name="mrp" className="form-control" placeholder="Enter M.R.P" value={formData.mrp} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label htmlFor="price" className="form-label">Selling Price</label>
                <input type="text" name="price" className="form-control" placeholder="Enter Selling Price" value={formData.price} onChange={handleChange} required />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-12">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea name="description" className="form-control" style={{ resize: "none", height: "150px" }} placeholder="Enter Description" value={formData.description} onChange={handleChange} required></textarea>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-12">
                <label htmlFor="image" className="form-label">Product Image</label>
                <input type="file" name="image" className="form-control" onChange={handleFileChange} required />
              </div>
            </div>
            <div className="mb-3">
              <button type="submit" className="btn btn-dark">Save Product</button>
              <button type="reset" className="btn btn-danger ms-1" onClick={() => setFormData({ name: "", mrp: "", price: "", description: "", image: null })}>Clear All</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;

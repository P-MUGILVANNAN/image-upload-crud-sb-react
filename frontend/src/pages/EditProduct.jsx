import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditProduct() {
    const { id } = useParams(); // Get product ID from URL
    const navigate = useNavigate();

    // State for form fields
    const [product, setProduct] = useState({
        name: '',
        mrp: '',
        price: '',
        description: '',
        image: null, // Store image file
        existingImage: '' // Store existing image URL
    });

    // Fetch product details by ID
    useEffect(() => {
        axios.get(`http://localhost:8080/api/products/${id}`)
            .then(response => {
                const data = response.data;
                setProduct({
                    name: data.name,
                    mrp: data.mrp,
                    price: data.price,
                    description: data.description,
                    existingImage: data.imageUrl // Store the existing image filename
                });
            })
            .catch(error => console.error("Error fetching product:", error));
    }, [id]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    // Handle file input change
    const handleFileChange = (e) => {
        setProduct({ ...product, image: e.target.files[0] });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("mrp", product.mrp);
        formData.append("price", product.price);
        formData.append("description", product.description);
        if (product.image) {
            formData.append("image", product.image);
        }

        try {
            await axios.put(`http://localhost:8080/api/products/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Product updated successfully!");
            navigate("/"); // Redirect to home page
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Error updating product.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <h5>
                    <i className="bi bi-pencil-square"></i> Edit Product
                </h5>
                <hr />
                <nav className="my-3">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/">Home</Link>
                        </li>
                        <li className="breadcrumb-item active">Edit Product</li>
                    </ol>
                </nav>
                <div className="col-md-8">
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <div className="col-md-12">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="text" name="name" className="form-control"
                                    value={product.name} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label htmlFor="mrp" className="form-label">MRP</label>
                                <input type="text" name="mrp" className="form-control"
                                    value={product.mrp} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="price" className="form-label">Selling Price</label>
                                <input type="text" name="price" className="form-control"
                                    value={product.price} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-12">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea name="description" className="form-control"
                                    style={{ resize: "none", height: "150px" }}
                                    value={product.description} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-12">
                                <label htmlFor="image" className="form-label">Product Image</label>
                                <input type="file" name="image" className="form-control" onChange={handleFileChange} />
                                {product.existingImage && (
                                    <div className="mt-2">
                                        <img src={`http://localhost:8080/uploads/${product.existingImage}`} 
                                             alt="Product" width="100" height="100" className="img-thumbnail" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mb-3">
                            <button type="submit" className="btn btn-dark">Update Product</button>
                            <button type="reset" className="btn btn-danger ms-1">Clear All</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditProduct;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [products, setProducts] = useState([]); // State for products

  useEffect(() => {
    // Fetch products from backend
    axios.get('http://localhost:8080/api/products') // Change the API URL if needed
      .then(response => {
        setProducts(response.data); // Set response data to state
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  // Delete product with confirmation
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/api/products/${id}`);
        alert("Product deleted successfully!");

        // Remove the deleted product from the UI
        setProducts(products.filter(product => product.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };
  

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="d-flex justify-content-between">
          <h5><i className="bi bi-journal-richtext"></i> Product Details</h5>
          <Link to='/addProduct' className='text-decoration-none'>
            <button className="btn btn-primary">
              <i className="bi bi-plus-circle"></i> New Product
            </button>
          </Link>
        </div>

        <div className="col-md-12 table-responsive mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Image</th>
                <th>Product Name</th>
                <th>MRP</th>
                <th>Selling</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td>
                      <img src={`http://localhost:8080/uploads/${product.imageUrl}`} 
                           alt="Product" 
                           width="50" height="50" 
                           className="img-thumbnail" />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.mrp}</td>
                    <td>{product.price}</td>
                    <td>
                      <Link to={`/editProduct/${product.id}`}><button className='btn btn-dark btn-sm'><i className="bi bi-pencil-square"></i></button></Link>
                      <button 
                      type="button" 
                      className='btn btn-danger btn-sm ms-1' 
                      onClick={() => deleteProduct(product.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No products available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;

import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';

function App() {


  return (
    <BrowserRouter>
    <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/addProduct' element={<AddProduct />} />
          <Route path='/editProduct/:id' element={<EditProduct />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App

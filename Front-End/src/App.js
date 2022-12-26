import './App.css';
import "react-toastify/dist/ReactToastify.css"; //for styling our toastify messages

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import NavBar from "./components/NavBar";
import Cart from "./components/Cart";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Register from "./components/auth/Register";
import Login from './components/auth/Login';
import CheckoutSuccess from './components/CheckoutSuccess';
import Dashboard from './components/admin/Dashboard';
import Products from './components/admin/Products'
import Summary from './components/admin/Summary';
import CreateProduct from './components/admin/CreateProduct';


function App() {
  return ( <div className="App">
    <BrowserRouter>
    <ToastContainer/>
    <NavBar/>
    <div className='content-container'>
      <Routes>
        <Route path = "/"  element = {<Home/>} />
        <Route path = "/cart" element = {<Cart/>} /> {/*/cart more specific than '/' , so start with that when using 'Routes'/Switch*/}
        <Route path = "/checkout-success" element = {<CheckoutSuccess/>} />
        <Route path = "/register" element ={<Register />} />
        <Route path = "/login" element = {<Login/>} />
        <Route path = "/admin" element = {<Dashboard/>}>
          <Route path = "products" element = {<Products/>}> {/*Not /products because it is nested*/}
            <Route path = "create-product" element = {<CreateProduct/>}/> {/*Not /products because it is nested*/}
          </Route>
          <Route path = "summary" element = {<Summary/>} /> {/*Not /summary because it is nested*/}
        </Route>
        {/*<Route path = "/not-found" element = {<NotFound/>} /> */}
        <Route path = "*" element = {<NotFound/>} /> {/*So the '*' element allows for redirection if no other path is fulfilled. Couldnt figure out how to do it using Navigate*/}
        {/*Redirect if none of the paths are found, to the not-found page*/}  
        {/*in react-dom v6 , component --> element, and initialization of routes looks like this ^*/}
      </Routes>
    </div>
    </BrowserRouter>
  </div>
  );
}
export default App;

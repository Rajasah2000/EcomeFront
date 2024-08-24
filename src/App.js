import "./App.css";
import { useEffect, useLayoutEffect } from "react";
import axios from "axios";
// import 'bootstrap/dist/css/bootstrap.min.css';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import {
  Navbar,
  Toast,
  Home,
  Shop,
  ProductPage,
  Login,
  Signup,
  Wishlist,
  Cart,
  Orders,
  useUserLogin,
  useWishlist,
  useCart,
} from "./index";
import PrivateRoute from "./Pages/PrivateRoute/PrivateRoute";
import ResetPassword from "./Pages/AuthenticationPages/ResetPassword";

const App = () => {
  const { userLoggedIn } = useUserLogin();
  const { dispatchUserWishlist } = useWishlist();
  const { dispatchUserCart } = useCart();
  // const location = useLocation();

  //   useEffect(() => {
  //     if(location?.pathname === "/login"){
  // alert("hii")
  //     }
  //   },[location])

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route element={<PrivateRoute />}></Route>
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/" exact element={<Home />} />
          <Route path="/shop" exact element={<Shop />} />
          <Route path="/single-product/:id" element={<ProductPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
        <Toast position="bottom-right" />
      </div>
    </Router>
  );
};

export default App;

import React, { useEffect } from "react";
import "./Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import {
  useUserLogin,
  useToast,
  useWishlist,
  useCart,
  useOrders,
  useSearchBar,
} from "../../index";
import { BsShopWindow, BsFillBagFill } from "react-icons/bs";
import { useUserContext } from "../../ContextSetup/ContextProvider";
import Helper from "../../AuthService/Helper";
import PageLoader from "../Loader/PageLoader";

function Navbar() {
  const { userWishlist, dispatchUserWishlist } = useWishlist();
  const { userCart, dispatchUserCart } = useCart();
  const { userOrders, dispatchUserOrders } = useOrders();
  const { setUserLoggedIn } = useUserLogin(false);
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { wishlistProduct, setWishlistProduct, cartData,OrderData, setAllCartData, getAllCartData } = useUserContext();
  console.log("ggggggggggggggg",wishlistProduct);
  const { searchBarTerm, setSearchBarTerm } = useSearchBar();

  const status = localStorage.getItem("status");


  useEffect(() => {
    getAllCartData();
  },[])


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwt_decode(token);

      if (!user) {
        localStorage.removeItem("token");
        setUserLoggedIn(false);
      } else {
        setUserLoggedIn(true);
      }
    }
  }, []);

  useEffect(() => {
    function handleInvalidToken() {
      if (localStorage.getItem("token") !== null) {
        setUserLoggedIn(true);
      } else {
        setUserLoggedIn(false);
        dispatchUserWishlist({ type: "UPDATE_USER_WISHLIST", payload: [] });
        dispatchUserCart({ type: "UPDATE_USER_CART", payload: [] });
        dispatchUserOrders({ type: "UPDATE_USER_ORDERS", payload: [] });
      }
    }
    window.addEventListener("storage", handleInvalidToken);

    return function cleanup() {
      window.removeEventListener("storage", handleInvalidToken);
    };
  }, [userWishlist, userCart]);

  function logoutUser() {
    localStorage.removeItem('token');
    // dispatchUserWishlist({ type: 'UPDATE_USER_WISHLIST', payload: [] });
    // dispatchUserCart({ type: 'UPDATE_USER_CART', payload: [] });
    // dispatchUserOrders({ type: 'UPDATE_USER_ORDERS', payload: [] });
    setUserLoggedIn(false);
    setAllCartData([]);
    setWishlistProduct([]);
    localStorage.clear();
    showToast('success', '', 'Logged out successfully');
    // Refresh the current page
 
    navigate('/login');
  }

  return (
    <div className="top-bar">
      <div className="left-topbar-container">
        {/* <button id="top-bar-ham-menu-btn" className="icon-btn"><i className="fa fa-bars" aria-hidden="true"></i></button> */}
        <Link to="/">
          <h2 className="top-bar-brand-name" style={{ fontSize: '3rem' }}>
            𝐑𝐔𝐙𝐀𝐍
          </h2>
        </Link>
        {/* {
                    location.pathname==="/shop" && 
                    (
                        <div className="search-bar">
                            <input 
                                className="search-bar-input" 
                                placeholder="Search"
                                value={searchBarTerm}
                                onChange={event=>setSearchBarTerm(event.target.value)}
                            />
                        </div>
                    )
                } */}

        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-input" />

          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 64 64">
            <linearGradient
              id="R8TaTjY68qDdglNtdLAaCa_48167_gr1"
              x1="32"
              x2="32"
              y1="9.083"
              y2="54.676"
              gradientUnits="userSpaceOnUse"
              spreadMethod="reflect"
            >
              <stop offset="0" stop-color="#1a6dff"></stop>
              <stop offset="1" stop-color="#c822ff"></stop>
            </linearGradient>
            <path
              fill="url(#R8TaTjY68qDdglNtdLAaCa_48167_gr1)"
              d="M50,55H14c-2.757,0-5-2.243-5-5V14c0-2.757,2.243-5,5-5h36c2.757,0,5,2.243,5,5v36 C55,52.757,52.757,55,50,55z M14,11c-1.654,0-3,1.346-3,3v36c0,1.654,1.346,3,3,3h36c1.654,0,3-1.346,3-3V14c0-1.654-1.346-3-3-3H14 z"
            ></path>
            <linearGradient
              id="R8TaTjY68qDdglNtdLAaCb_48167_gr2"
              x1="33.5"
              x2="33.5"
              y1="10.438"
              y2="55.752"
              gradientUnits="userSpaceOnUse"
              spreadMethod="reflect"
            >
              <stop offset="0" stop-color="#1a6dff"></stop>
              <stop offset="1" stop-color="#c822ff"></stop>
            </linearGradient>
            <path
              fill="url(#R8TaTjY68qDdglNtdLAaCb_48167_gr2)"
              d="M47,45.545l-8.387-8.388C40.103,35.344,41,33.025,41,30.5C41,24.71,36.29,20,30.5,20 S20,24.71,20,30.5S24.71,41,30.5,41c2.525,0,4.845-0.897,6.658-2.388L45.545,47L47,45.545z M30.5,39c-4.687,0-8.5-3.813-8.5-8.5 s3.813-8.5,8.5-8.5s8.5,3.813,8.5,8.5S35.187,39,30.5,39z"
            ></path>
            <linearGradient
              id="R8TaTjY68qDdglNtdLAaCc_48167_gr3"
              x1="30.5"
              x2="30.5"
              y1="24"
              y2="37"
              gradientUnits="userSpaceOnUse"
              spreadMethod="reflect"
            >
              <stop offset="0" stop-color="#6dc7ff"></stop>
              <stop offset="1" stop-color="#e6abff"></stop>
            </linearGradient>
            <path
              fill="url(#R8TaTjY68qDdglNtdLAaCc_48167_gr3)"
              d="M30.5 24A6.5 6.5 0 1 0 30.5 37A6.5 6.5 0 1 0 30.5 24Z"
            ></path>
          </svg>
        </div>
      </div>
      <div className="right-topbar-container">
        <div className="auth-buttons">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="30"
            height="30"
            viewBox="0 0 30 30"
            style={{ color: 'white' }}
          >
            <path d="M18,19v-2c0.45-0.223,1.737-1.755,1.872-2.952c0.354-0.027,0.91-0.352,1.074-1.635c0.088-0.689-0.262-1.076-0.474-1.198 c0,0,0.528-1.003,0.528-2.214c0-2.428-0.953-4.5-3-4.5c0,0-0.711-1.5-3-1.5c-4.242,0-6,2.721-6,6c0,1.104,0.528,2.214,0.528,2.214 c-0.212,0.122-0.562,0.51-0.474,1.198c0.164,1.283,0.72,1.608,1.074,1.635C10.263,15.245,11.55,16.777,12,17v2c-1,3-9,1-9,8h24 C27,20,19,22,18,19z"></path>
          </svg>
          {localStorage.getItem('token') !== null ? (
            <span className="signIn" style={{ cursor: 'pointer' }} onClick={logoutUser}>
              Logout
            </span>
          ) : (
            <span
              className="signIn"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                navigate('/login');
              }}
            >
              Sign In
            </span>
          )}
        </div>
        <Link to="/shop" title="shop">
          <button
            className="icon-btn"
            // onClick={() =>
            //   status ? "" : showToast("error", "", "Kindly Login !")
            // }
          >
            <div>
              <BsShopWindow />
            </div>
          </button>
        </Link>
        <Link to="/wishlist">
          <button
            className="icon-btn"
            title="wishlist"
            // onClick={() =>
            //   status ? "" : showToast("error", "", "Kindly Login !")
            // }
          >
            <div className="icon-count-badge">
              <i className="fa fa-heart-o fa-x" aria-hidden="true"></i>
              {wishlistProduct?.length !== 0 && <span className="count-badge-x">{wishlistProduct?.length}</span>}
            </div>
          </button>
        </Link>
        <Link to="/cart">
          <button
            className="icon-btn"
            title="cart"
            // onClick={() =>
            //   status ? "" : showToast("error", "", "Kindly Login !")
            // }
          >
            <div className="icon-count-badge">
              <i className="fa fa-shopping-cart fa-x" aria-hidden="true"></i>
              {cartData?.length !== 0 && <span className="count-badge-x">{cartData?.length}</span>}
            </div>
          </button>
        </Link>
        <Link to="/orders">
          <button
            className="icon-btn"
            title="orders"
            // onClick={() =>
            //   status ? "" : showToast("error", "", "Kindly Login !")
            // }
          >
            <div className="icon-count-badge">
              <BsFillBagFill
                style={{
                  marginBottom: '4px',
                }}
              />
              {OrderData.length !== 0 && <span className="count-badge-x">{OrderData.length}</span>}
            </div>
          </button>
        </Link>
        {/* {
                    localStorage.getItem('token')!==null
                    ? (
                        <button onClick={logoutUser} className="navbar-login-btn solid-primary-btn">Logout</button>
                    )
                    : (
                        <Link to="/login">
                            <button className="navbar-login-btn solid-primary-btn">SignIn</button>
                        </Link>
                    )
                } */}
      </div>
      {/* <PageLoader /> */}
    </div>
  );
}

export { Navbar };

import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import "./UserAuth.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  useToast,
  useUserLogin,
  useWishlist,
  useCart,
  useOrders,
} from "../../index";
import Helper from "../../AuthService/Helper";
import { useUserContext } from "../../ContextSetup/ContextProvider";

function Login() {
  const { setUserLoggedIn } = useUserLogin();
  const { showToast } = useToast();
  const { dispatchUserWishlist } = useWishlist();
  const { dispatchUserCart } = useCart();
  const { dispatchUserOrders } = useOrders();
  const {userId , setUserId} = useUserContext();

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [email, setEmail] = useState("");
  const [modalA, setModalA] = useState(true);
  console.log("dsdfffffffffffff", modalA);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const user = jwt_decode(token);
      if (!user) {
        localStorage.removeItem("token");
      } else {
        (async function getUpdatedWishlistAndCart() {
          let updatedUserInfo = await axios.get(
            "https://bookztron-server.vercel.app/api/user",
            {
              headers: {
                "x-access-token": localStorage.getItem("token"),
              },
            }
          );

          if (updatedUserInfo.data.status === "ok") {
            dispatchUserWishlist({
              type: "UPDATE_USER_WISHLIST",
              payload: updatedUserInfo.data.user.wishlist,
            });
            dispatchUserCart({
              type: "UPDATE_USER_CART",
              payload: updatedUserInfo.data.user.cart,
            });
            dispatchUserOrders({
              type: "UPDATE_USER_ORDERS",
              payload: updatedUserInfo.data.user.orders,
            });
          }
        })();
      }
    }
  }, [dispatchUserCart, dispatchUserOrders, dispatchUserWishlist]);

  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    if (userEmail === "") {
      return showToast("error", "", "Email field is required");
    }
    if (userPassword === "") {
      return showToast("error", "", "Password field is required");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      return showToast("error", "", "Email is invalid");
    }
    if (userPassword.length <= 5) {
      return showToast(
        "error",
        "",
        "Password length must be greater than five character"
      );
    }
    try {
      let data = {
        email: userEmail,
        password: userPassword,
        role: "user",
      };

      const res = await Helper(
        "http://localhost:3004/api/admin/login",
        "POST",
        data
      );
      if (res && res.status) {
        //User created successfully, navigate to Login Page
        localStorage.setItem("token", res.token);
        localStorage.setItem("status", true);
        localStorage.setItem('Id', res?.data?._id);

        setUserId(res?.data?._id);
        setUserEmail("");
        setUserPassword("");
        showToast("success", "", "Logged in successfully");
        navigate("/shop");
      } else {
        showToast("error", "", res.message);
      }
    } catch (error) {
      showToast("error", "", "Error logging in user. Please try again");
    }
  };

  const handleEmail = async (e) => {
    e.preventDefault();

    // Simple password validation
    if (email === "") {
      return showToast("error", "", "Email field is required");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return showToast("error", "", "Email is invalid");
    }

    try {
      let data = {
        email: email,
      };

      const res = await Helper(
        "http://localhost:3004/api/admin/send-email",
        "POST",
        data
      );
      if (res && res?.status) {
        showToast("success", "", "Email send successfully");
        setEmail("");
        setModalA(true);
        // navigate('/');
      } else {
        showToast("error", "", res?.message);
      }
    } catch (error) {
      showToast("error", "", "Error sending email in user. Please try again");
    }
  };

  return (
    <>
      {modalA ? (
        <div className="user-auth-content-container">
          <form onSubmit={loginUser} className="user-auth-form">
            <h2>Login</h2>

            <div className="user-auth-input-container">
              <label htmlFor="user-auth-input-email">
                <h4>Email address</h4>
              </label>
              <input
                id="user-auth-input-email"
                className="user-auth-form-input"
                type="text"
                placeholder="Email"
                value={userEmail}
                onChange={(event) => setUserEmail(event.target.value)}
                // required
              />
            </div>

            <div className="user-auth-input-container">
              <label htmlFor="user-auth-input-password">
                <h4>Password</h4>
              </label>
              <input
                id="user-auth-input-password"
                className="user-auth-form-input"
                type="password"
                placeholder="Password"
                value={userPassword}
                onChange={(event) => setUserPassword(event.target.value)}
                // required
              />
            </div>

            <div className="user-options-container">
              <div className="remember-me-container">
                <input type="checkbox" id="remember-me" />
                <label htmlFor="remember-me">Remember Me</label>
              </div>
              <div>
                <div
                  onClick={() => setModalA(false)}
                  className="links-with-blue-underline"
                  id="forgot-password"
                  style={{ cursor: "pointer" }}
                >
                  Forgot Password?
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="solid-success-btn form-user-auth-submit-btn"
            >
              Login
            </button>

            <div className="new-user-container">
              <Link
                to="/signup"
                className="links-with-blue-underline"
                id="new-user-link"
              >
                Create new account &nbsp;
              </Link>
            </div>
          </form>
        </div>
      ) : (
        <div className="user-auth-content-container">
          <form onSubmit={handleEmail} className="user-auth-form">
            <div style={{ display: "flex" }}>
              <h2>Send Email</h2>
              <div
                style={{
                  position: "relative",
                  top: "24px",
                  fontSize: "19px",
                  fontWeight: 600,
                  color: "red",
                  left: "175px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setModalA(true);
                }}
              >
                X
              </div>
            </div>

            <div className="user-auth-input-container">
              <label htmlFor="user-auth-input-email">
                <h4>Email address</h4>
              </label>
              <input
                id="user-auth-input-email"
                className="user-auth-form-input"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                // required
              />
            </div>

            <button
              type="submit"
              className="solid-success-btn form-user-auth-submit-btn"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export { Login };

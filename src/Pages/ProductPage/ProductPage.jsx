import { useEffect, useState } from "react";
import "./ProductPage.css";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useToast, useWishlist, useCart } from "../../index";
import ReactImageMagnify from "react-image-magnify";
import Helper from "../../AuthService/Helper";

function ProductPage() {
  const navigate = useNavigate();

  const { dispatchUserWishlist } = useWishlist();
  const { dispatchUserCart } = useCart();
  const { showToast } = useToast();
  const [singleProductData, setSingleProductData] = useState({});

  const { id } = useParams();
  console.log("singleProductData", singleProductData, id);
  useEffect(() => {
    if (id) {
      GetsingleProduct(id);
    }
  }, [id]);

  const GetsingleProduct = async (id) => {

    try {
      const res = await Helper(
        `http://localhost:3004/api/admin/get-singleproduct/${id}`,
        "GET"
      );
      if (res && res.status) {
        console.log("RESJKJK", res);
        setSingleProductData(res?.product);
      } else {
        showToast("error", "", res.message);
      }
    } catch (error) {
      showToast(
        "error",
        "",
        "Error fetch single product data . Please try again"
      );
    }
  };
  const productDetailsOnStorage = localStorage.getItem(`${id}`);
  const productdetails = JSON.parse(productDetailsOnStorage);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   if (token) {
  //     const user = jwt_decode(token);
  //     if (!user) {
  //       localStorage.removeItem("token");
  //     } else {
  //       (async function getUpdatedWishlistAndCart() {
  //         let updatedUserInfo = await axios.get(
  //           "https://bookztron-server.vercel.app/api/user",
  //           {
  //             headers: {
  //               "x-access-token": localStorage.getItem("token"),
  //             },
  //           }
  //         );

  //         if (updatedUserInfo.data.status === "ok") {
  //           dispatchUserWishlist({
  //             type: "UPDATE_USER_WISHLIST",
  //             payload: updatedUserInfo.data.user.wishlist,
  //           });
  //           dispatchUserCart({
  //             type: "UPDATE_USER_CART",
  //             payload: updatedUserInfo.data.user.cart,
  //           });
  //         }
  //       })();
  //     }
  //   }
  // }, []);

  // async function addItemToWishlist() {
  //   const token = localStorage.getItem("token");

  //   if (token) {
  //     const user = jwt_decode(token);

  //     if (!user) {
  //       localStorage.removeItem("token");
  //       showToast("warning", "", "Kindly Login");
  //       navigate("/login");
  //     } else {
  //       let wishlistUpdateResponse = await axios.patch(
  //         "https://bookztron-server.vercel.app/api/wishlist",
  //         {
  //           productdetails,
  //         },
  //         {
  //           headers: {
  //             "x-access-token": localStorage.getItem("token"),
  //           },
  //         }
  //       );

  //       if (wishlistUpdateResponse.data.status === "ok") {
  //         dispatchUserWishlist({
  //           type: "UPDATE_USER_WISHLIST",
  //           payload: wishlistUpdateResponse.data.user.wishlist,
  //         });
  //         showToast("success", "", "Item successfully added to wishlist");
  //       }
  //     }
  //   } else {
  //     showToast("warning", "", "Kindly Login");
  //   }
  // }

  const addItemToWishlist = () => {
    if (!localStorage?.getItem("token")) {
      showToast("error", "", "Kindly login!");
      navigate("/login");
    }
  };

  async function addItemToCart() {
    if (!localStorage?.getItem("token")) {
      showToast("error", "", "Kindly login!");
      navigate("/login");
    }
    // const token = localStorage.getItem("token");

    // if (token) {
    //   const user = jwt_decode(token);

    //   if (!user) {
    //     localStorage.removeItem("token");
    //     showToast("warning", "", "Kindly Login");
    //     navigate("/login");
    //   } else {
    //     let cartUpdateResponse = await axios.patch(
    //       "https://bookztron-server.vercel.app/api/cart",
    //       {
    //         productdetails,
    //       },
    //       {
    //         headers: {
    //           "x-access-token": localStorage.getItem("token"),
    //         },
    //       }
    //     );
    //     if (cartUpdateResponse.data.status === "ok") {
    //       dispatchUserCart({
    //         type: "UPDATE_USER_CART",
    //         payload: cartUpdateResponse.data.user.cart,
    //       });
    //       showToast("success", "", "Item successfully added to cart");
    //     }
    //   }
    // } else {
    //   showToast("warning", "", "Kindly Login");
    // }
  }

  function ProductRating({ rating }) {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<FaStar key={i} />);
    }

    return <div style={{ color: "#ff9800", marginTop: "3px" }}>{stars}</div>;
  }

  return (
    <>
      <div className="product-page-container">
        <div className="product-page-item">
          <ReactImageMagnify
            {...{
              smallImage: {
                // alt: imgAlt,
                // src: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1690206497/Croma%20Assets/Communication/Headphones%20and%20Earphones/Images/272562_1_pkexam.png?tr=w-360',
                src: singleProductData?.images,
                width: 250,
                height: 360,
              },
              largeImage: {
                // src: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1690206497/Croma%20Assets/Communication/Headphones%20and%20Earphones/Images/272562_1_pkexam.png?tr=w-360',
                src: singleProductData?.images,
                width: 1200,
                height: 1200,
              },
              imageClassName: "bookcover-image",
              enlargedImagePosition: "beside",
              enlargedImageContainerDimensions: {
                width: "315%",
                height: "100%",
              },
              enlargedImageContainerClassName: "enlarged-image-container",
              enlargedImageStyle: {
                filter: "blur(0px) brightness(1)",
              },
            }}
          />
          <div className="item-details">
            <h2>{singleProductData?.name}</h2>
            <hr />
            <p style={{ display: "flex" }}>
              <b>Rating :</b>&nbsp;&nbsp;
              {/* <span>{singleProductData?.ratings}</span> */}
              <ProductRating rating={singleProductData?.ratings} />
            </p>
            <p className="item-description">
              <b>Description :</b>&nbsp;&nbsp;
              <span>{singleProductData?.description}</span>
            </p>
            <p className="item-rating">
              <b>Quantity :</b>&nbsp;&nbsp;
              <span>{singleProductData?.quantity}</span>
            </p>
            <h3 className="item-price-details">
              Rs. {singleProductData?.price}&nbsp;&nbsp;
              <del>
                Rs.{" "}
                {Math.round(
                  (singleProductData?.price * singleProductData?.percentOff) /
                    100 +
                    singleProductData?.price
                )}
              </del>
              &nbsp;&nbsp;
              <span className="discount-on-item">
                ({singleProductData?.percentOff}% off)
              </span>
            </h3>
            {/* {outOfStock ? (
              <p className="out-of-stock-text">
                Item is currently out of stock
              </p>
            ) : ( */}
            <div className="item-buttons">
              <button onClick={addItemToWishlist} className="solid-primary-btn">
                Add to wishlist
              </button>
              <button onClick={addItemToCart} className="solid-warning-btn">
                Add to cart
              </button>
            </div>
            {/* )} */}
          </div>
        </div>
      </div>
    </>
  );
}

export { ProductPage };

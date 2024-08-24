import "./Orders.css"
import { useEffect } from "react";
import jwt_decode from "jwt-decode"
import axios from "axios";
import { Link, useLocation } from "react-router-dom"
import { ProductOrderCard, useWishlist, useCart, useOrders } from '../../index';
import Lottie from 'react-lottie';
import GuyWithBookLottie from "../../Assets/Icons/guy_with_book.json"
import { useUserContext } from "../../ContextSetup/ContextProvider";

function Orders()
{
    const { userWishlist, dispatchUserWishlist } = useWishlist()
    const { userCart, dispatchUserCart } = useCart()
    const { userOrders, dispatchUserOrders } = useOrders()
    const {OrderData} = useUserContext();
    let guyWithBookObj = {
        loop: true,
        autoplay: true,
        animationData : GuyWithBookLottie,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    }
    const { pathname } = useLocation();
  
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(()=>{
        const token=localStorage.getItem('token')

        if(token)
        {
            const user = jwt_decode(token)
            if(!user)
            {
                localStorage.removeItem('token')
            }
            else
            {
                if(userOrders.length===0)
                {
                    (async function getUpdatedWishlistAndCart()
                    {
                        let updatedUserInfo = await axios.get(
                        "https://bookztron-server.vercel.app/api/user",
                        {
                            headers:
                            {
                            'x-access-token': localStorage.getItem('token'),
                            }
                        })
                        if(updatedUserInfo.data.status==="ok")
                        {
                            dispatchUserOrders({type: "UPDATE_USER_ORDERS",payload: updatedUserInfo.data.user.orders})                   
                            if(userWishlist.length===0)
                            {
                                dispatchUserWishlist({type: "UPDATE_USER_WISHLIST",payload: updatedUserInfo.data.user.wishlist})
                                
                            }
                            if(userCart.length===0)
                            {
                                dispatchUserCart({type: "UPDATE_USER_CART",payload: updatedUserInfo.data.user.cart})
                            }
                        }
                    })()
                }
            }
        }
        else
        {
            dispatchUserOrders({type: "UPDATE_USER_ORDERS",payload: []})
        }   
    },[])

    // console.log('hhjhjhuyuyuyuyu', OrderData);
    

    return (
      <div className="orders-content-container">
        <h2>
          {OrderData?.length} {OrderData?.length === 1 ? 'item' : 'items'} in your Orders
        </h2>
        {OrderData?.length === 0 ? (
          <div className="no-orders-message-container">
            <Lottie options={guyWithBookObj} height={350} width={350} isStopped={false} isPaused={false} />
            <h2>You have not placed any orders</h2>
            <Link to="/cart">
              <button className=" solid-primary-btn">Go to cart</button>
            </Link>
          </div>
        ) : (
          // <div className="orders-container">
          //   {OrderData.map((productDetails, index) => (
          //     <ProductOrderCard key={index} productDetails={productDetails} />
          //   ))}
          // </div>
          OrderData?.map((ele) => {
            return (
              <section
                style={{
                  padding: '20px',
                  fontFamily: 'Arial, sans-serif',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', // Box shadow for the entire section
                  borderRadius: '10px', // Rounded corners for the section
                  backgroundColor: '#ffffff', // Background color for the section
                  maxWidth: '800px', // Max width to center the content
                  margin: '10px auto', // Center the section horizontally
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                  {/* Left Section - Delivery Address */}
                  <div
                    style={{
                      flex: '1',
                      minWidth: '250px',
                      backgroundColor: '#f9f9f9',
                      padding: '20px',
                      borderRadius: '10px',
                    }}
                  >
                    <h3
                      style={{
                        marginBottom: '15px',
                        color: '#333',
                        textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        position: 'relative',
                      }}
                    >
                      Delivery Address
                      <span
                        style={{
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(45deg, #f9f9f9, rgba(255, 255, 255, 0))',
                          zIndex: '-1',
                          transform: 'translate(3px, 3px)',
                          borderRadius: 'inherit',
                        }}
                      ></span>
                    </h3>
                    <p style={{ marginBottom: '10px' }}>
                      {/* <span style={{ fontWeight: 'bold', color: '#555' }}>Name:</span> */}
                      {ele?.userName}
                    </p>
                    <p style={{ marginBottom: '10px' }}>
                      <span style={{ fontWeight: 'bold', color: '#555' }}>Phone Number:</span> {ele?.phoneNumber}
                    </p>
                    <p style={{ marginBottom: '10px' }}>
                      <span style={{ fontWeight: 'bold', color: '#555' }}>Postal Code:</span> {ele.postalCode}
                    </p>
                    <p style={{ marginBottom: '10px' }}>
                      <span style={{ fontWeight: 'bold', color: '#555' }}>Address:</span> {ele?.address}
                    </p>
                    <p style={{ marginBottom: '10px' }}>
                      <span style={{ fontWeight: 'bold', color: '#555' }}>Total Payment:</span>{' '}
                      <span style={{ fontWeight: 'bold' }}> ₹ {ele.totalAmount}</span>
                    </p>
                    <p style={{ marginBottom: '10px' }}>
                      <span style={{ fontWeight: 'bold', color: '#555' }}>Payment Method :</span>
                      <span style={{ fontWeight: 'bold' }}>
                        {ele?.paymentMode === 'cod' ? 'Cash on Delivery' : `Online ${ele?.paymentStatus}`}
                      </span>{' '}
                    </p>
                    <p style={{ marginBottom: '10px', color: '#007bff', fontWeight: 'bold' }}>
                      <span style={{ fontWeight: 'bold', color: '#555' }}>Status:</span> ● {ele?.OrderStatus}
                    </p>
                  </div>

                  {/* Right Section - Order Listing */}
                  <div style={{ flex: '2', minWidth: '250px' }}>
                    {ele?.items?.map(ele => {
                      return (
                        <div
                          style={{
                            marginBottom: '20px',
                            padding: '20px',
                            borderRadius: '10px',
                            backgroundColor: '#ffffff',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ flex: '1' }}>
                              <img
                                src={ele?.productDetails?.images}
                                alt="Product"
                                style={{ width: '100%', borderRadius: '10px' }}
                              />
                            </div>
                            <div style={{ flex: '3' }}>
                              <h4 style={{ marginBottom: '10px' }}>{ele?.productDetails?.name}</h4>
                              <p style={{ marginBottom: '5px' }}>
                                {' '}
                                {ele?.productDetails?.description.split(' ').slice(0, 11).join(' ') + '...'}
                              </p>
                              <p style={{ marginBottom: '5px' }}>
                                {' '}
                                Quantity: <span style={{ fontSize: '17px', fontWeight: 'bold' }}>{ele?.quantity}</span>
                              </p>
                              {/* <p style={{ marginBottom: '5px' }}>Size: M</p> */}
                              <h3 style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                                <p style={{ marginBottom: '10px' }}>
                                  <span style={{ fontWeight: 'bold', color: '#555' }}>Price per piece :</span>₹
                                  {ele?.productDetails?.price}
                                </p>
                              </h3>
                              <h4 style={{ marginBottom: '10px', color: '#28a745' }}>
                                Status: <span style={{ color: '#2c28b1', fontWeight: 'bold' }}>● Confirmed</span>
                              </h4>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <a href="#" style={{ fontSize: '13px', color: '#005C8F', cursor: 'pointer' }}>
                                  Write Review
                                </a>
                                <button
                                  style={{
                                    padding: '5px 10px',
                                    backgroundColor: '#dc3545',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })

        )}
      </div>
    );
}

export { Orders }
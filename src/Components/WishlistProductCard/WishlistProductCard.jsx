import React,{ useEffect, useState} from 'react'
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import jwt_decode from "jwt-decode";
import './WishlistProductCard.css'
import {
    useToast,
    useWishlist,
    useCart
} from '../../index'
import Helper from '../../AuthService/Helper';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useUserContext } from '../../ContextSetup/ContextProvider';

const WishlistProductCard = ({ key, productdetails, getAlllWishlistData }) => {
  const navigate = useNavigate();
  console.log('productdetails', productdetails);
  const { userWishlist, dispatchUserWishlist } = useWishlist();
  const { wishlistProduct, setWishlistProduct, getAllCartData } = useUserContext();
  const { dispatchUserCart } = useCart();
  const { showToast } = useToast();
  const {
    _id,
    bookName,
    author,
    originalPrice,
    discountedPrice,
    discountPercent,
    imgSrc,
    imgAlt,
    badgeText,
    outOfStock,
  } = productdetails;
  const [wishlistHeartIcon, setWishlistHeartIcon] = useState('fa-heart-o');
  const [wishlistBtn, setWishlistBtn] = useState('add-to-wishlist-btn');

  useEffect(() => {
    const index = userWishlist.findIndex(product => {
      return product._id === productdetails._id;
    });

    if (index !== -1) {
      setWishlistHeartIcon('fa-heart');
      setWishlistBtn('added-to-wishlist-btn');
    } else {
      setWishlistHeartIcon('fa-heart-o');
      setWishlistBtn('add-to-wishlist-btn');
    }
  }, [userWishlist, productdetails._id, setWishlistHeartIcon, setWishlistBtn]);

  // aos animation
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);
  const userId = localStorage?.getItem('Id');

  async function addOrRemoveItemToWishlist() {
    if (wishlistHeartIcon === 'fa-heart-o' && wishlistBtn === 'add-to-wishlist-btn') {
      //Item not present in wishlist, add it
      const token = localStorage.getItem('token');

      if (token) {
        const user = jwt_decode(token);

        if (!user) {
          localStorage.removeItem('token');
          showToast('warning', '', 'Kindly Login');
          navigate('/login');
        } else {
          let wishlistUpdateResponse = await axios.patch(
            'https://bookztron-server.vercel.app/api/wishlist',
            {
              productdetails,
            },
            {
              headers: {
                'x-access-token': localStorage.getItem('token'),
              },
            }
          );

          if (wishlistUpdateResponse.data.status === 'ok') {
            setWishlistHeartIcon('fa-heart');
            setWishlistBtn('added-to-wishlist-btn');
            dispatchUserWishlist({ type: 'UPDATE_USER_WISHLIST', payload: wishlistUpdateResponse.data.user.wishlist });
            showToast('success', '', 'Item successfully added to wishlist');
          }
        }
      } else {
        showToast('warning', '', 'Kindly Login');
      }
    } else {
      //Item present in wishlist, remove it
      const token = localStorage.getItem('token');

      if (token) {
        const user = jwt_decode(token);

        if (!user) {
          localStorage.removeItem('token');
          showToast('warning', '', 'Kindly Login');
          navigate('/login');
        } else {
          let wishlistUpdateResponse = await axios.delete(
            `https://bookztron-server.vercel.app/api/wishlist/${productdetails._id}`,
            {
              headers: {
                'x-access-token': localStorage.getItem('token'),
              },
            },
            {
              productdetails,
            }
          );
          if (wishlistUpdateResponse.data.status === 'ok') {
            setWishlistHeartIcon('fa-heart-o');
            setWishlistBtn('add-to-wishlist-btn');
            dispatchUserWishlist({ type: 'UPDATE_USER_WISHLIST', payload: wishlistUpdateResponse.data.user.wishlist });
            showToast('success', '', 'Item successfully deleted from wishlist');
          }
        }
      } else {
        showToast('warning', '', 'Kindly Login');
      }
    }
  }

  function addEllipsisAfter4Words(text) {
    const words = text.split(' ');
    let result = '';
    for (let i = 0; i < Math.min(words.length, 3); i++) {
      result += words[i] + ' ';
    }
    if (words.length > 3) {
      result += '...';
    }
    return result.trim();
  }

  async function addItemToCart(productData) {
    const token = localStorage.getItem('token');

    if (token) {
      const user = jwt_decode(token);

      if (!user) {
        localStorage.removeItem('token');
        showToast('warning', '', 'Kindly Login');
        navigate('/login');
      } else {
        let data = {
          user_id: productData?.user_id,
          product_id: productData?.wishlistProductdata?._id,
        };
        const res = await Helper(`http://localhost:3004/api/admin/add-to-cart`, 'POST', data);
        if (res && res?.status) {
          showToast('success', '', 'Item successfully added to cart');
          getAllCartData();
        } else {
          showToast('error', '', 'Failed to  added to cart');
        }
      }
    } else {
      showToast('warning', '', 'Kindly Login');
    }
  }

  const fetchAllWishlistData = async userId => {
    try {
      const res = await Helper(`http://localhost:3004/api/admin/wishlist/${userId}`, 'GET');
      console.log('Response:', res);
      if (res && res.status) {
        setWishlistProduct(res.data);
      } else {
        console.log('Error response:', res);
        showToast('error', '', 'Unexpected response format');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('error', '', 'Error to fetch item to wishlist. Please try again');
    }
  };

  const getWishlistProductId = async productId => {
    try {
      const res = await Helper(`http://localhost:3004/api/admin/wishlist/${userId}`, 'GET');
      if (res && res.status) {
        const filterData = res?.data?.filter(ele => ele?.user_id === userId && ele?.product_id === productId);

        return filterData[0]?._id;
      } else {
        showToast('error', '', res.message);
      }
    } catch (error) {
      showToast('error', '', 'Error to fetch item to wishlist. Please try again');
    }
  };

  const AddItemToWishlist = async (event, productId) => {
    event.preventDefault();
    event.stopPropagation();
    if (!localStorage?.getItem('token')) {
      showToast('error', '', 'Kindly login!');
      navigate('/login');
    } else {
      try {
        let data = {
          user_id: userId,
          product_id: productId,
        };

        const res = await Helper('http://localhost:3004/api/admin/add-to-wishlist', 'POST', data);
        if (res && res.status) {
          showToast('success', '', res?.message);
          fetchAllWishlistData(userId);
          if (selectedCategoryId) {
            fetchProductCategoryWise(selectedCategoryId);
          } else {
            GetAllProduct();
          }
        } else {
          showToast('error', '', res.message);
        }
      } catch (error) {
        showToast('error', '', 'Error to add item to wishlist. Please try again');
      }
    }
  };

  const RemoveItemToWishlist = async (event, wishlistId) => {
    event.preventDefault();
    event.stopPropagation();
    if (!localStorage?.getItem('token')) {
      showToast('error', '', 'Kindly login!');
      navigate('/login');
    }

    console.log('klijkjkjkl', wishlistId);

    try {
      const res = await Helper(`http://localhost:3004/api/admin/remove-from-wishlist/${wishlistId}`, 'DELETE');
      if (res && res.status) {
        showToast('success', '', res?.message);
        fetchAllWishlistData(userId);
        getAlllWishlistData();
        if (selectedCategoryId) {
          fetchProductCategoryWise(selectedCategoryId);
        } else {
          GetAllProduct();
        }
      } else {
        showToast('error', '', res.message);
      }
    } catch (error) {
      //  showToast('error', '', 'Error to remove item to wishlist. Please try again');
    }
  };

  return (
    // <Link
    //   to={`/shop/${_id}`}
    //   onClick={() => localStorage.setItem(`${_id}`, JSON.stringify(productdetails))}
    //   target="_blank"
    //   rel="noopener noreferrer"
    // >
    //   <div className="card-basic wishlist-card">
    //     <img src="http://localhost:3004/uploads\\headphones1.webp" alt={imgAlt} />
    //     <div className="card-item-details">
    //       <div className="item-title">
    //         <h4>Gita book</h4>
    //       </div>
    //       <h5 className="item-author">- By &nbsp;Rahul Panday</h5>
    //       <p>
    //         <b>Rs. 200 &nbsp;&nbsp;</b>
    //         <del>Rs. 1200 </del> &nbsp;&nbsp;
    //         <span className="discount-on-card">(20% off)</span>
    //       </p>
    //       <div className="card-button">
    //         <button
    //           onClick={event => {
    //             event.preventDefault();
    //             event.stopPropagation();
    //             addOrRemoveItemToWishlist();
    //           }}
    //           className={`card-icon-btn ${wishlistBtn} outline-card-secondary-btn`}
    //         >
    //           <i className={`fa fa-x ${wishlistHeartIcon}`} aria-hidden="true"></i>
    //         </button>
    //       </div>
    //       <div className="badge-on-card">{badgeText}</div>
    //       {outOfStock && (
    //         <div className="card-text-overlay-container">
    //           <p>Out of Stock</p>
    //         </div>
    //       )}
    //     </div>
    // <button
    //   className="solid-primary-btn add-wishlist-item-to-cart-btn"
    //   onClick={event => {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     addItemToCart(event);
    //   }}
    // >
    //   Add to Cart
    // </button>
    //   </div>
    // </Link>

    <div style={{ marginTop: '12px' }} data-aos="flip-left" data-aos-duration="3000">
      <div
        // onClick={() => {
        //   // navigate(`/single-product/${productdetails?._id}`);
        // }}
        rel="noopener noreferrer"
      >
        <div className="card-basic" style={{ borderRadius: '1rem', padding: '12px' }}>
          <img src={productdetails?.wishlistProductdata?.images} />
          <div className="card-item-details">
            <div className="item-title" style={{ height: '2.68rem' }}>
              <h4 style={{ margin: '1.2rem 0' }}>
                {addEllipsisAfter4Words(productdetails?.wishlistProductdata?.name)}
              </h4>
            </div>
            <h5 className="item-author" style={{ margin: '1rem 0px' }}>
              {productdetails?.wishlistProductdata?.quantity} - &nbsp;Quantity
            </h5>
            <p>
              <b>Rs. {productdetails?.wishlistProductdata?.price} &nbsp;&nbsp;</b>
              <del>
                Rs.{' '}
                {Math.round(
                  (productdetails?.wishlistProductdata?.price * productdetails?.wishlistProductdata?.percentOff) / 100 +
                    productdetails?.wishlistProductdata?.price
                )}
              </del>{' '}
              &nbsp;&nbsp;
              <span className="discount-on-card" style={{ fontSize: '12px' }}>
                ({productdetails?.wishlistProductdata?.percentOff}% off)
              </span>
            </p>
            <div className="card-button">
              <div className="card-button">
                <button
                  onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (!localStorage?.getItem('token')) {
                      showToast('error', '', 'Kindly login!');
                      navigate('/login');
                    }
                    // addOrRemoveItemToWishlist();
                  }}
                  className={`card-icon-btn add-to-wishlist-btn outline-card-secondary-btn`}
                >
                  {/* <i className={`fa fa-x fa-heart-o`} aria-hidden="true"></i> */}
                </button>
              </div>
              <div className="badge-on-card">Deals</div>

              {productdetails?.wishlistProductdata?.iswishlisted ? (
                <button
                  onClick={event => {
                    RemoveItemToWishlist(event, productdetails?._id);
                  }}
                  className={` card-icon-btn
                                  added-to-wishlist-btn
                                  outline-card-secondary-btn`}
                >
                  <i className={`fa fa-x fa-heart`} aria-hidden="true"></i>
                </button>
              ) : (
                <button
                  onClick={event => {
                    AddItemToWishlist(event, productdetails?._id);
                  }}
                  className={`card-icon-btn add-to-wishlist-btn outline-card-secondary-btn`}
                >
                  <i className={`fa fa-x fa-heart-o`} aria-hidden="true"></i>
                </button>
              )}
            </div>
            <div className="badge-on-card">Deals</div>
            {/* {outOfStock && (
                    <div className="card-text-overlay-container">
                      <p>Out of Stock</p>
                    </div>
                  )} */}
          </div>
          <button
            className="solid-primary-btn add-wishlist-item-to-cart-btn"
            onClick={event => {
              event.preventDefault();
              event.stopPropagation();
              addItemToCart(productdetails);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export { WishlistProductCard };
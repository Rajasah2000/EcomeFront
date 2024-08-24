import "./HorizontalProductCard.css"
import { useState } from "react"
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom"
import { useToast, useCart, useWishlist } from "../../index"
import { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Helper from "../../AuthService/Helper";
import { useUserContext } from "../../ContextSetup/ContextProvider";

function HorizontalProductCard({productDetails})

{
  const navigate = useNavigate();
  const { getAllCartData } = useUserContext();
  const { showToast } = useToast();
  const { dispatchUserWishlist } = useWishlist();
  const { dispatchUserCart } = useCart();
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
    quantity,
  } = productDetails;
  const productdetails = productDetails;

  const [productQuantity, setProductQuantity] = useState(Number(productDetails?.quantity));

  // aos animation
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  console.log('ghfjghfdgjkdfhjk', productDetails);
  // useEffect(()=>{
  //     (async function onQuantityChange()
  //     {

  //         let newQuantity = productQuantity
  //         let quantityUpdateResponse = await axios.patch(
  //             `https://bookztron-server.vercel.app/api/cart/${_id}`,
  //             {
  //                 newQuantity
  //             },
  //             {
  //                 headers:
  //                 {
  //                     'x-access-token': localStorage.getItem('token'),
  //                 }
  //             }
  //         )

  //         if(quantityUpdateResponse.data.status==="ok")
  //         {
  //             dispatchUserCart({type: "UPDATE_USER_CART",payload: quantityUpdateResponse.data.user.cart})
  //         }
  //         else
  //         {
  //             showToast("error","","Something went wrong!")
  //         }
  //     })()
  // },[productQuantity])

  async function removeItemFromCart(event) {
    const token = localStorage.getItem('token');

    if (token) {
      const user = jwt_decode(token);

      if (!user) {
        localStorage.removeItem('token');
        showToast('warning', '', 'Kindly Login');
        navigate('/login');
      } else {
        try {
          let res = await Helper(`http://localhost:3004/api/admin/remove-cart-data/${productDetails._id}`, 'DELETE');
          if (res && res.status) {
            showToast('success', '', 'Cart item remove successfully');
            getAllCartData();
          } else {
            showToast('error', '', 'Failed to remove cart data');
          }
        } catch (error) {
          console.error('Error:', error);
          // showToast('error', '', 'Error to fetch item to cart. Please try again');
        }
      }
    } else {
      showToast('warning', '', 'Kindly Login');
    }
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
         product_id: productData?.CartProductdata?._id,
       };
       const res = await Helper(`http://localhost:3004/api/admin/add-to-cart`, 'POST', data);
       if (res && res?.status) {
  
         getAllCartData();
       } else {
        //  showToast('error', '', 'Failed to  added to cart');
       }
     }
   } else {
     showToast('warning', '', 'Kindly Login');
   }
 }

  async function addItemToCartQuantityDec(productData) {

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
         product_id: productData?.CartProductdata?._id,
       };
       const res = await Helper(`http://localhost:3004/api/admin/add-to-cart-dec`, 'POST', data);
       if (res && res?.status) {
  
         getAllCartData();
       } else {
        //  showToast('error', '', 'Failed to  added to cart');
       }
     }
   } else {
     showToast('warning', '', 'Kindly Login');
   }
 }
 

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

  return (
    <div
      className="card-basic-horizontal"
      data-aos="flip-left"
      data-aos-easing="ease-out-cubic"
      data-aos-duration="1000"
    >
      <img className="cart-item-book-img" src={productDetails?.CartProductdata?.images} alt="" />
      <div id="cart-item-detail" className="card-item-details">
        <h4 id="item-title">{productDetails?.CartProductdata?.name}</h4>
        <p className="item-author">Type - &nbsp;{productDetails?.CartProductdata?.categorydata?.name}</p>
        <p className="price-details">
          &#8377; {productDetails?.CartProductdata?.price} &nbsp;&nbsp;
          <del>
            &#8377;{' '}
            {Math.round(
              (productDetails?.CartProductdata?.price * productDetails?.CartProductdata?.percentOff) / 100 +
                productDetails?.CartProductdata?.price
            )}
          </del>{' '}
          &nbsp;&nbsp;
          <span className="discount-on-card">{productDetails?.CartProductdata?.percentOff}% off</span>
        </p>

        <div className="item-cart-quantity">
          <p className="cart-quantity-para">Quantity : &nbsp;&nbsp;</p>
          <div className="quantity-manage-container">
            <div
              style={{ disabled: true }}
              className="quantity-change"
              onClick={() => {
                if (productQuantity > 1) {
                  setProductQuantity(prevQuantity => Number(prevQuantity) - 1);
                  addItemToCartQuantityDec(productDetails);
                  getAllCartData();
                } else {
                  showToast('error', '', 'Quantity cannot be less than 1');
                }
              }}
            >
              -
            </div>
            <input
              className="cart-item-quantity-input"
              value={productQuantity}
              onChange={event => {
                setProductQuantity(event.target.value);
                //  addItemToCart(productDetails);
                
              }}
              type="text"
              maxLength="3"
              autoComplete="off"
            />
            <div
              className="quantity-change"
              onClick={() => {
                setProductQuantity(prevQuantity => Number(prevQuantity) + 1);
                addItemToCart(productDetails);
                getAllCartData();
              }}
            >
              +
            </div>
          </div>
        </div>

        <div className="cart-horizontal-card-btns card-button">
          <button className="solid-primary-btn" onClick={event => removeItemFromCart(event)}>
            Remove from Cart
          </button>
          <button
            className="outline-primary-btn"
            onClick={() => {
              if (productDetails?.CartProductdata?.iswishlisted) {
                showToast('success', '', 'Item allready added to wishlist');
              }
            }}
          >
            Add to Wishlist
          </button>
        </div>
        <div className="badge-on-card">Deals</div>
      </div>
    </div>
  );
}

export { HorizontalProductCard }
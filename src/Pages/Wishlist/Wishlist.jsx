import "./Wishlist.css"
import jwt_decode from "jwt-decode";
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import {  } from "../../Context/wishlist-context"
import { 
    WishlistProductCard,
    useWishlist,
    useCart, 
    useToast
} from "../../index"
import Lottie from 'react-lottie';
import HeartLottie from "../../Assets/Icons/heart.json"
import { useEffect, useState } from "react";
import Helper from "../../AuthService/Helper";

function Wishlist()
{
    const { userWishlist, dispatchUserWishlist } = useWishlist()
    const [WishlistData , setAllWishlistData ] = useState([]);
      const { showToast } = useToast();
    console.log('WishlistData', WishlistData);
    const { dispatchUserCart } = useCart()
  const userId = localStorage.getItem("Id");
    let heartObj = {
        loop: true,
        autoplay: true,
        animationData : HeartLottie,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    }

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
                        dispatchUserWishlist({type: "UPDATE_USER_WISHLIST",payload: updatedUserInfo.data.user.wishlist})
                        dispatchUserCart({type: "UPDATE_USER_CART",payload: updatedUserInfo.data.user.cart})
                    }
                })()
            }
        }   
    },[])
    useEffect(() => {
      getAlllWishlistData()
    }, [])

    const getAlllWishlistData = async() => {
      try {
       
      const res = await Helper(`http://localhost:3004/api/admin/wishlist/${userId}`, 'GET');
      if (res && res.status) {
      setAllWishlistData(res?.data);
      } else {
        showToast("error", "", res.message);
      }
      } catch (error) {
        showToast('error', '', 'Error to fetch wishlist data. Please try again');
      }
    }

    return (
      <div className="wishlist-container">
        <h2>
          {WishlistData.length} {WishlistData.length === 1 ? 'item' : 'items'} in Wishlist
        </h2>
        <div className="products-card-grid">
          {JSON.stringify(WishlistData) !== JSON.stringify([]) ? (
            WishlistData.map(productdetails => (
              <WishlistProductCard key={productdetails._id} productdetails={productdetails} />
            ))
          ) : (
            <div className="empty-wishlist-message-container">
              <Lottie options={heartObj} height={150} width={150} isStopped={false} isPaused={false} />
              <h2>Your wishlist is empty 🙃</h2>
              <Link to="/shop">
                <button className=" solid-primary-btn">Go to shop</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
}

export { Wishlist }
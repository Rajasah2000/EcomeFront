import React, { useEffect, useState } from 'react'
import Helper from '../AuthService/Helper';
import { useToast, useWishlist, useCart } from '../index';

const userContext = React.createContext(null);

export const useUserContext =() => React.useContext(userContext);



const ContextProvider = ({children}) => {
  const [allProduct, setAllProduct] = useState([]);
    const [sortPriceLowToHigh, setSortPriceLowToHigh] = useState(false);
    const [sortPriceHighToLow, setSortPriceHighToLow] = useState(false);
    const [wishlistProduct , setWishlistProduct] = useState([]);
    const [cartData , setAllCartData] = useState([]);
    const [OrderData , setOrderData] = useState([])
      const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    console.log('gsgjhsfghfklhk', wishlistProduct, cartData);
    const [userId , setUserId] = useState("")
    
    const userIds = localStorage?.getItem('Id');
    const { showToast } = useToast();



    useEffect(() => {
      userIds && fetchAllWishlistData(userIds);
      userIds && getAllCartData(userIds);
      userIds && getAllOrderData(userIds);
    }, [userIds]);

    const fetchAllWishlistData = async userIds => {
      try {
        const res = await Helper(`http://localhost:3004/api/admin/wishlist/${userIds}`, 'GET');
        console.log('Response:', res);
        if (res && res.status) {
          console.log('Data:', res.data);
          setWishlistProduct(res.data);
        } else {
          console.log('Error response:', res);
          showToast('error', '', 'Unexpected response format');
        }
      } catch (error) {
        console.error('Error:', error);
        // showToast('error', '', 'Error to fetch item to wishlist. Please try again');
      }
    };



    const getAllCartData = async() => {
      try {
        if(localStorage.getItem('token')){
          let res = await Helper(`http://localhost:3004/api/admin/get-all-cart/${userIds}`, 'GET');
          if (res && res.status) {
            setAllCartData(res.data);
          } else {
            console.log('Failed to fetch cart data');
            // showToast('error', '', 'Failed to fetch cart data');
          }
        } 
        
      } catch (error) {
    console.error('Error:', error);
        // showToast('error', '', 'Error to fetch item to cart. Please try again');
      }
      
    };


    const getAllOrderData = async (userIds) => {
      // alert("jkjkjk")
      try {
        const res = await Helper(`http://localhost:3004/api/admin/get-all-order/${userIds}`, 'GET');
        console.log('Response:', res);
        if (res && res.status) {
          console.log('Dataffffff:', res.data);
          setOrderData(res.data);
        } else {
          console.log('Error response:', res);
          showToast('error', '', 'Unexpected response format');
        }
      } catch (error) {
        console.error('Error:', error);
        // showToast('error', '', 'Error to fetch item to wishlist. Please try again');
      }
    };


  return (
    <>
      <userContext.Provider
        value={{
          cartData,
          setAllCartData,
          getAllCartData,
          allProduct,
          setAllProduct,
          sortPriceLowToHigh,
          setSortPriceLowToHigh,
          sortPriceHighToLow,
          setSortPriceHighToLow,
          userId,
          setUserId,
          wishlistProduct,
          setWishlistProduct,
          fetchAllWishlistData,
          selectedCategoryId,
          setSelectedCategoryId,
          getAllOrderData,
          OrderData,
          setOrderData,
        }}
      >
        {children}
      </userContext.Provider>
    </>
  );
}

export default ContextProvider
import React, { useEffect, useState } from 'react'
import Helper from '../AuthService/Helper';

const userContext = React.createContext(null);

export const useUserContext =() => React.useContext(userContext);



const ContextProvider = ({children}) => {
  const [allProduct, setAllProduct] = useState([]);
    const [sortPriceLowToHigh, setSortPriceLowToHigh] = useState(false);
    const [sortPriceHighToLow, setSortPriceHighToLow] = useState(false);
    const [wishlistProduct , setWishlistProduct] = useState([]);
      const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    console.log('gsgjhsfghfklhk', wishlistProduct);
    const [userId , setUserId] = useState("")
    const userIds = localStorage?.getItem('Id');

    useEffect(() => {
      userIds && fetchAllWishlistData(userIds);
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
        showToast('error', '', 'Error to fetch item to wishlist. Please try again');
      }
    };


  return (
    <>
      <userContext.Provider
        value={{
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
        }}
      >
        {children}
      </userContext.Provider>
    </>
  );
}

export default ContextProvider
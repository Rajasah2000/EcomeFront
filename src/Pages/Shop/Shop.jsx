import React, { useState, useEffect, useContext } from 'react';
import jwt_decode from 'jwt-decode';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import './Shop.css';
import { Sidebar, ProductCard, useWishlist, useCart, useSearchBar, Pagination, useToast } from '../../index.js';
import { useProductAvailable } from '../../Context/product-context';
import axios from 'axios';
import Helper from '../../AuthService/Helper.js';
import { useUserContext } from '../../ContextSetup/ContextProvider.js';

function Shop(props) {
  let { productsAvailableList, dispatchSortedProductsList, productFilterOptions } = useProductAvailable();
  const location = useLocation();

  const {
    allProduct,
    setAllProduct,
    sortPriceLowToHigh,
    fetchAllWishlistData,
    // userId,
    sortPriceHighToLow,
  } = useUserContext();

  const userId = localStorage?.getItem('Id');

  const { dispatchUserWishlist } = useWishlist();
  const { dispatchUserCart } = useCart();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { searchBarTerm } = useSearchBar();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const { selectedCategoryId, setSelectedCategoryId } = useUserContext();
  const { showToast } = useToast();

  console.log('allProduct', allProduct);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, currentPage]);

  useEffect(() => {
    if (
      JSON.stringify(productsAvailableList) === JSON.stringify([]) &&
      JSON.stringify(productFilterOptions) ===
        JSON.stringify({
          includeOutOfStock: true,
          onlyFastDeliveryProducts: false,
          minPrice: 0,
          maxPrice: 1200,
          fiction: true,
          thriller: true,
          tech: true,
          philosophy: true,
          romance: true,
          manga: true,
          minRating: 1,
        })
    ) {
      //Refresh happened - Filters are default yet productsAvailableList is empty
      //Redo api call to get data
      try {
        (async () => {
          const productsAvailableData = await axios.get('https://bookztron-server.vercel.app/api/home/products');
          dispatchSortedProductsList({
            type: 'ADD_ITEMS_TO_PRODUCTS_AVAILABLE_LIST',
            payload: [...productsAvailableData.data.productsList],
          });
        })();
      } catch (error) {
        console.log('Error : ', error);
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const user = jwt_decode(token);
      if (!user) {
        localStorage.removeItem('token');
      } else {
        (async function getUpdatedWishlistAndCart() {
          let updatedUserInfo = await axios.get('https://bookztron-server.vercel.app/api/user', {
            headers: {
              'x-access-token': localStorage.getItem('token'),
            },
          });

          if (updatedUserInfo.data.status === 'ok') {
            dispatchUserWishlist({
              type: 'UPDATE_USER_WISHLIST',
              payload: updatedUserInfo.data.user.wishlist,
            });
            dispatchUserCart({
              type: 'UPDATE_USER_CART',
              payload: updatedUserInfo.data.user.cart,
            });
          }
        })();
      }
    }
  }, []);

  useEffect(() => {
    if (!location?.state) {
      GetAllProduct();
    }
  }, [location]);

  const GetAllProduct = async () => {
    try {
      const res = await Helper('http://localhost:3004/api/admin/get-all-product', 'GET');
      if (res && res.status) {
        console.log('AAAAAAAAAAAAAAAAAAA', res?.data);
        setAllProduct(res?.data);
      } else {
        showToast('error', '', res.message);
      }
    } catch (error) {
      showToast('error', '', 'Error fetch all product data . Please try again');
    }
  };

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
  const getWishlistProductId = async productId => {
    try {
      const res = await Helper(`http://localhost:3004/api/admin/wishlist/${userId}`, 'GET');
      if (res && res.status) {
        const filterData = res?.data?.filter(ele => ele?.user_id === userId && ele?.product_id === productId);

        console.log('jkfjkjjkljkljjl', filterData[0]?._id);
        return filterData[0]?._id;
      } else {
        showToast('error', '', res.message);
      }
    } catch (error) {
      showToast('error', '', 'Error to fetch item to wishlist. Please try again');
    }
  };

  let searchedProducts = productsAvailableList.filter(productdetails => {
    return (
      productdetails.bookName.toLowerCase().includes(searchBarTerm.toLowerCase()) ||
      productdetails.author.toLowerCase().includes(searchBarTerm.toLowerCase())
    );
  });

  //  Fetch  Product Category wise

  const fetchProductCategoryWise = async categoryId => {
    try {
      const res = await Helper(`http://localhost:3004/api/admin/get-product-by-category/${categoryId}`, 'GET');
      if (res && res?.status) {
       
          setAllProduct(res?.data);
        } else {
         
        console.log("Error");
        }
      } 
    catch (error) {
      console.log('err', error);
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

  const RemoveItemToWishlist = async (event, productId) => {
    event.preventDefault();
    event.stopPropagation();
    if (!localStorage?.getItem('token')) {
      showToast('error', '', 'Kindly login!');
      navigate('/login');
    }
    try {
      const wislistId = await getWishlistProductId(productId);
      const res = await Helper(`http://localhost:3004/api/admin/remove-from-wishlist/${wislistId}`, 'DELETE');
      if (res && res.status) {
        showToast('error', '', res?.message);
        fetchAllWishlistData(userId);
        if (selectedCategoryId) {
          fetchProductCategoryWise(selectedCategoryId);
        } else {
          GetAllProduct();
        }
      } else {
        showToast('error', '', res.message);
      }
      console.log('wislistId', wislistId);
    } catch (error) {
      showToast('error', '', 'Error to remove item to wishlist. Please try again');
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  let currentSearchedProducts = searchedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  // let currentProductsAvailableList = productsAvailableList.slice(
  //   indexOfFirstProduct,
  //   indexOfLastProduct
  // );
  let currentProductsAvailableList = allProduct.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div>
      <div className="shop-container">
        <Sidebar categoryId={location?.state} />
        <div className="products-container">
          <h2>Showing {allProduct.length} products</h2>
          {/* <div className="products-card-grid">
            {productsAvailableList &&
              (searchBarTerm === ""
                ? currentProductsAvailableList.map((productdetails) => (
                    <ProductCard
                      key={productdetails._id}
                      productdetails={productdetails}
                    />
                  ))
                : currentSearchedProducts.map((productdetails) => (
                    <ProductCard
                      key={productdetails._id}
                      productdetails={productdetails}
                    />
                  )))}
          </div> */}
          {/* .sort(() => Math.random() - 0.5) ? */}
          <div className="products-card-grid">
            {sortPriceLowToHigh || sortPriceHighToLow ? (
              <>
                {currentProductsAvailableList.map(ele => {
                  return (
                    <div
                      style={{ marginTop: '12px' }}
                      // onClick={alert("jodd")}
                    >
                      <div
                        onClick={() => {
                          navigate(`/single-product/${ele?._id}`);
                        }}
                        // to={`/single-product/${ele?._id}`}
                        // onClick={() =>
                        // localStorage.setItem(`${_id}`, JSON.stringify(productdetails))
                        // }
                        // target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="card-basic" style={{ borderRadius: '1rem', padding: '12px' }}>
                          {/* <img src="https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1698384810/Croma%20Assets/Entertainment/Wireless%20Earbuds/Images/302477_wo2pp4.png" /> */}
                          <img src={ele?.images} />
                          <div className="card-item-details">
                            <div className="item-title">
                              <h4>{addEllipsisAfter4Words(ele?.name)}</h4>
                            </div>
                            <h5 className="item-author">{ele?.quantity} - &nbsp;Quantity</h5>
                            <p>
                              <b>Rs. {ele?.price} &nbsp;&nbsp;</b>
                              <del>Rs. {Math.round((ele?.price * ele?.percentOff) / 100 + ele?.price)}</del>{' '}
                              &nbsp;&nbsp;
                              <span className="discount-on-card" style={{ fontSize: '12px' }}>
                                ({ele?.percentOff}% off)
                              </span>
                            </p>
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
                            {/* {outOfStock && (
                    <div className="card-text-overlay-container">
                      <p>Out of Stock</p>
                    </div>
                  )} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              // .sort(() => Math.random() - 0.5)
              currentProductsAvailableList?.map(ele => {
                return (
                  <div
                    style={{ marginTop: '12px' }}
                    // onClick={alert("jodd")}
                  >
                    <div
                      onClick={() => {
                        navigate(`/single-product/${ele?._id}`);
                      }}
                      rel="noopener noreferrer"
                    >
                      <div className="card-basic" style={{ borderRadius: '1rem', padding: '12px' }}>
                   
                        <img src={ele?.images} />
                        <div className="card-item-details">
                          <div className="item-title">
                            <h4>{addEllipsisAfter4Words(ele?.name)}</h4>
                          </div>
                          <h5 className="item-author">{ele?.quantity} - &nbsp;Quantity</h5>
                          <p>
                            <b>Rs. {ele?.price} &nbsp;&nbsp;</b>
                            <del>Rs. {Math.round((ele?.price * ele?.percentOff) / 100 + ele?.price)}</del> &nbsp;&nbsp;
                            <span className="discount-on-card" style={{ fontSize: '12px' }}>
                              ({ele?.percentOff}% off)
                            </span>
                          </p>
                          <div className="card-button">
                            {ele?.iswishlisted ? (
                              <button
                                onClick={event => {
                                  RemoveItemToWishlist(event, ele?._id);
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
                                  AddItemToWishlist(event, ele?._id);
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
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {/* <Pagination
            productsPerPage={productsPerPage}
            totalProducts={
              searchBarTerm === ""
                ? productsAvailableList.length
                : searchedProducts.length
            }
            paginate={setCurrentPage}
          /> */}
          <Pagination productsPerPage={productsPerPage} totalProducts={allProduct.length} paginate={setCurrentPage} />
        </div>
      </div>
    </div>
  );
}

export { Shop };

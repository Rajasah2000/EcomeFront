import React, { useState, useEffect, useRef } from 'react';
import './Sidebar.css';
import { useProductAvailable } from '../../Context/product-context';
import { useGenre } from '../../Context/genre-context';
import Helper from '../../AuthService/Helper';
import { useUserContext } from '../../ContextSetup/ContextProvider';

function Sidebar(catId) {
  const [category, setCategory] = useState([]);
  const {
    allProduct,
    setAllProduct,
    sortPriceLowToHigh,
    setSortPriceLowToHigh,
    sortPriceHighToLow,
    setSortPriceHighToLow,
    selectedCategoryId,
    setSelectedCategoryId,
  } = useUserContext();

  useEffect(async() => {
   
    if(catId){
      setSelectedCategoryId(catId?.categoryId);
      try {
      const res = await Helper(`http://localhost:3004/api/admin/get-product-by-category/${catId?.categoryId}`, 'GET');
      if (res && res?.status) {
       
          // alert("Hello")
          console.log("Resfsdfsdfsdf",res?.data);
          setCategoryWiseProduct(res?.data);
          setAllProduct(res?.data);
        }
      
    } catch (error) {
      console.log('err', error);
    }
    }
  },[])

  const { productsAvailableList, dispatchSortedProductsList, productFilterOptions, dispatchProductFilterOptions } =
    useProductAvailable();

  const {
    fictionCategoryCheckbox,
    setFictionCategoryCheckbox,
    thrillerCategoryCheckbox,
    setThrillerCategoryCheckbox,
    techCategoryCheckbox,
    setTechCategoryCheckbox,
    philosophyCategoryCheckbox,
    setPhilosophyCategoryCheckbox,
    romanceCategoryCheckbox,
    setRomanceCategoryCheckbox,
    mangaCategoryCheckbox,
    setMangaCategoryCheckbox,
  } = useGenre();


  const [ratings, selectedRating] = useState(null);
  const [categoryWiseProduct, setCategoryWiseProduct] = useState([]);
  // const [productData , setAllProductData] = useState([])
  console.log('ratingdsg', ratings);

  const handleCheckboxChange = async (categoryId, value) => {
    window.scroll(0, 0);
    setSelectedCategoryId(categoryId === selectedCategoryId ? null : categoryId);

    if (value == true) {
      selectedRating(null);
      try {
        const res = await Helper('http://localhost:3004/api/admin/get-all-product', 'GET');
        if (res && res.status) {
          // setAllProductData(res?.data);
          setAllProduct(res?.data);
        } else {
          showToast('error', '', res.message);
        }
      } catch (error) {
        showToast('error', '', 'Error fetch all product data . Please try again');
      }
    } else {
      fetchProductCategoryWise(categoryId);
    }
  };

  const HandleRating = async rating => {
    console.log('allfdsfsdfsd', allProduct, rating);
    // setSelectedCategoryId("");
    // setMaxPriceRange(1200);
    // setMinPriceRange(0)
    selectedRating(rating === ratings ? null : rating);
    let filterData = [];
    if (selectedCategoryId && minPriceRange && maxPriceRange) {
      const filterPRoduct = allProduct?.filter(ele => ele?.ratings >= rating);
      setAllProduct(filterPRoduct);
      return;
    }
    if (selectedCategoryId) {
      const filterPRoduct = categoryWiseProduct?.filter(ele => ele?.ratings >= rating);
      setAllProduct(filterPRoduct);
    } else {
      try {
        const res = await Helper('http://localhost:3004/api/admin/get-all-product', 'GET');
        if (res && res.status) {
          filterData = res?.data?.filter(ele => ele?.ratings >= rating);
          setAllProduct(filterData);
        } else {
          showToast('error', '', res.message);
        }
      } catch (error) {
        showToast('error', '', 'Error fetch all product data . Please try again');
      }
    }
  };

  // }

  useEffect(() => {
    fetchAllCategory();
  }, []);

  //   Fetch All Category

  const fetchAllCategory = async () => {
    try {
      const res = await Helper('http://localhost:3004/api/admin/get-all-category', 'GET');
      if (res && res?.status) {
        setCategory(res?.data);
      } else {
      }
    } catch (error) {
      console.log('err', error);
    }
  };

  //  Fetch  Product Category wise

  const fetchProductCategoryWise = async categoryId => {
    try {
      const res = await Helper(`http://localhost:3004/api/admin/get-product-by-category/${categoryId}`, 'GET');
      if (res && res?.status) {
        if (maxPriceRange && minPriceRange) {
          const filData = res?.data?.filter(ele => ele?.price >= minPriceRange && ele?.price <= maxPriceRange);
          setAllProduct(filData);
        } else {
          setCategoryWiseProduct(res?.data);
          setAllProduct(res?.data);
        }
      } else {
      }
    } catch (error) {
      console.log('err', error);
    }
  };

  const ratingRadioBtnRef = useRef(null);

  // const [sortPriceLowToHigh, setSortPriceLowToHigh] = useState(false);
  // const [sortPriceHighToLow, setSortPriceHighToLow] = useState(false);

  const [includeOutOfStockCheckbox, setIncludeOutOfStockCheckbox] = useState(true);
  const [fastDeliveryOnlyCheckbox, setFastDeliveryOnlyCheckbox] = useState(false);

  const [minPriceRange, setMinPriceRange] = useState(0);
  const [maxPriceRange, setMaxPriceRange] = useState(1200);
  console.log(minPriceRange, maxPriceRange, 'minPriceRange');

  useEffect(() => {
    dispatchSortedProductsList({
      type: 'UPDATE_LIST_AS_PER_FILTERS',
      payload: productFilterOptions,
    });
    if (sortPriceLowToHigh) {
      setSortPriceLowToHigh(true);
      setSortPriceHighToLow(false);
      dispatchSortedProductsList({ type: 'PRICE_LOW_TO_HIGH' });
    }
    if (sortPriceHighToLow) {
      setSortPriceLowToHigh(false);
      setSortPriceHighToLow(true);
      dispatchSortedProductsList({ type: 'PRICE_HIGH_TO_LOW' });
    }
  }, [productFilterOptions, dispatchSortedProductsList]);

  const clearFilters = async () => {
    selectedRating(null);
    setSelectedCategoryId('');
    setSortPriceLowToHigh(false);
    setSortPriceHighToLow(false);
    setMinPriceRange(0);
    setMaxPriceRange(1200);

    try {
      const res = await Helper('http://localhost:3004/api/admin/get-all-product', 'GET');
      if (res && res.status) {
        setAllProduct(res?.data);
      } else {
        showToast('error', '', res.message);
      }
    } catch (error) {
      showToast('error', '', 'Error fetch all product data . Please try again');
    }

    setFictionCategoryCheckbox(true);
    setThrillerCategoryCheckbox(true);
    setTechCategoryCheckbox(true);
    setPhilosophyCategoryCheckbox(true);
    setRomanceCategoryCheckbox(true);
    setMangaCategoryCheckbox(true);
    ratingRadioBtnRef.current.click();

    setIncludeOutOfStockCheckbox(true);
    setFastDeliveryOnlyCheckbox(false);
    dispatchProductFilterOptions({ type: 'RESET_DEFAULT_FILTERS' });
  };

  return (
    <aside className="product-page-sidebar">
      <div className="filter-clear-options">
        <p className="sidebar-filter-option">Filters</p>
        <p onClick={clearFilters} className="sidebar-clear-option text-underline">
          Clear
        </p>
      </div>

      <div className="price-slider">
        <p>Price</p>

        <div className="price-input">
          <div className="field">
            <span>Min</span>
            <input
              onChange={async e => {
                setMinPriceRange(e.target.value);
                selectedRating(null);
                setSelectedCategoryId('');
                setSortPriceLowToHigh(false);
                setSortPriceHighToLow(false);
                if (e.target.value === '0' || e.target.value === '00' || e.target.value === '000') {
                  console.log('ggggggggggggggggggg', e.target.value);
                  try {
                    const res = await Helper('http://localhost:3004/api/admin/get-all-product', 'GET');
                    if (res && res.status) {
                      setAllProduct(res?.data);
                      return;
                    } else {
                      showToast('error', '', res.message);
                    }
                  } catch (error) {
                    showToast('error', '', 'Error fetch all product data . Please try again');
                  }
                }

                if (maxPriceRange - e.target.value > 100) {
                  try {
                    const res = await Helper('http://localhost:3004/api/admin/get-all-product', 'GET');
                    if (res && res.status) {
                      const filterRangeData = res?.data?.filter(
                        ele => ele?.price >= e.target.value && ele?.price <= maxPriceRange
                      );
                      setAllProduct(filterRangeData);
                    } else {
                      showToast('error', '', res.message);
                    }
                  } catch (error) {
                    showToast('error', '', 'Error fetch all product data . Please try again');
                  }

                  // dispatchProductFilterOptions({
                  //   type: 'UPDATE_MIN_PRICE_RANGE_FILTER',
                  //   minPrice: e.target.value,
                  // });
                }
              }}
              type="number"
              className="input-min"
              value={minPriceRange}
              max="10000"
            />
          </div>
          <div className="separator">-</div>
          <div className="field">
            <span>Max</span>
            <input
              onChange={async e => {
                setMaxPriceRange(e.target.value);
                selectedRating(null);
                setSelectedCategoryId('');
                setSortPriceLowToHigh(false);
                setSortPriceHighToLow(false);
                if (e.target.value === '0' || e.target.value === '00' || e.target.value === '000') {
                  console.log('ggggggggggggggggggg', e.target.value);
                  try {
                    const res = await Helper('http://localhost:3004/api/admin/get-all-product', 'GET');
                    if (res && res.status) {
                      setAllProduct(res?.data);
                      return;
                    } else {
                      showToast('error', '', res.message);
                    }
                  } catch (error) {
                    showToast('error', '', 'Error fetch all product data . Please try again');
                  }
                }

                if (e.target.value - minPriceRange > 100) {
                  try {
                    const res = await Helper('http://localhost:3004/api/admin/get-all-product', 'GET');
                    if (res && res.status) {
                      const filterRangeData = res?.data?.filter(
                        ele => ele?.price >= minPriceRange && ele?.price <= e.target.value
                      );
                      setAllProduct(filterRangeData);
                    } else {
                      showToast('error', '', res.message);
                    }
                  } catch (error) {
                    showToast('error', '', 'Error fetching all product data. Please try again');
                  }
                }
              }}
              type="number"
              className="input-max"
              value={maxPriceRange}
              max="10000"
            />
          </div>
        </div>

        <div className="slider">
          <div
            className="progress"
            style={{
              left: (minPriceRange / 1200) * 100 + '%',
              right: 100 - (maxPriceRange / 1200) * 100 + '%',
            }}
          ></div>
        </div>

        <div className="range-input">
          <input
            onChange={async e => {
              if (maxPriceRange - e.target.value > 100) {
                setMinPriceRange(e.target.value);
              }
            }}
            type="range"
            className="range-min"
            min="0"
            max="1200"
            value={minPriceRange}
            step="50"
          />
          <input
            onChange={async e => {
              setMaxPriceRange(e.target.value);
              selectedRating(null);
              setSelectedCategoryId('');
              setSortPriceLowToHigh(false);
              setSortPriceHighToLow(false);
              if (e.target.value === '0' || e.target.value === '00' || e.target.value === '000') {
                console.log('ggggggggggggggggggg', e.target.value);
                try {
                  const res = await Helper('http://localhost:3004/api/admin/get-all-product', 'GET');
                  if (res && res.status) {
                    setAllProduct(res?.data);
                    return;
                  } else {
                    showToast('error', '', res.message);
                  }
                } catch (error) {
                  showToast('error', '', 'Error fetch all product data . Please try again');
                }
              }

              if (e.target.value - minPriceRange > 100) {
                try {
                  const res = await Helper('http://localhost:3004/api/admin/get-all-product', 'GET');
                  if (res && res.status) {
                    const filterRangeData = res?.data?.filter(
                      ele => ele?.price >= minPriceRange && ele?.price <= e.target.value
                    );
                    setAllProduct(filterRangeData);
                  } else {
                    showToast('error', '', res.message);
                  }
                } catch (error) {
                  showToast('error', '', 'Error fetching all product data. Please try again');
                }
              }
            }}
            type="range"
            className="range-max"
            min="0"
            max="1200"
            value={maxPriceRange}
            step="50"
          />
        </div>
      </div>

      <div className="product-category">
        <p>Category</p>
        <div>
          {category?.map(category => (
            <div key={category._id} className="checkbox-item">
              <input
                type="checkbox"
                checked={category._id === selectedCategoryId}
                onChange={() => handleCheckboxChange(category._id, category._id === selectedCategoryId)}
              />
              <label>{category.name}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="product-page-rating-radio">
        <p>Rating</p>
        {[1, 2, 3, 4]?.map((ele, index) => {
          return (
            <div className="rating-items">
              <input
                onChange={
                  () => HandleRating(ele)
                  // dispatchProductFilterOptions({
                  //   type: 'UPDATE_MINIMUM_RATING_FILTER',
                  //   minRating: 4,
                  // })
                }
                type="radio"
                id="4-stars-or-above"
                name="rating"
                checked={ele === ratings}
                // value="4-stars-or-above"
              />
              <label htmlFor="4-stars-or-above">{ele} stars or above</label>
            </div>
          );
        })}
      </div>

      <div className="product-page-sortby-radio">
        <p>Sort By</p>

        <div className="sortby-items">
          <input
            onChange={() => {
              setSortPriceLowToHigh(!sortPriceLowToHigh);
              setSortPriceHighToLow(false);
              // Sort products by price low to high
              const productsLowToHigh = [...allProduct].sort((a, b) => a.price - b.price);
              setAllProduct(productsLowToHigh);
            }}
            type="radio"
            id="price-low-to-high"
            name="sort-by"
            value="price-low-to-high"
            checked={sortPriceLowToHigh}
            // checked={false}
          />
          <label htmlFor="price-low-to-high">Price - Low to High</label>
        </div>

        <div className="sortby-items">
          <input
            onChange={() => {
              setSortPriceLowToHigh(false);
              setSortPriceHighToLow(true);
              // Sort products by price high to low
              console.log(allProduct, 'allProduct');
              const productsLowToHigh = [...allProduct].sort((a, b) => b.price - a.price);
              setAllProduct(productsLowToHigh);
              // dispatchSortedProductsList({ type: 'PRICE_HIGH_TO_LOW' });
            }}
            type="radio"
            id="price-high-to-low"
            name="sort-by"
            value="price-high-to-low"
            checked={sortPriceHighToLow}
          />
          <label htmlFor="price-high-to-low">Price - High to Low</label>
        </div>
      </div>

      <div className="additional-filters">
        <p>Additional filters</p>

        <div>
          <input
            id="out-of-stock-checkbox"
            value=""
            onChange={e => {
              setIncludeOutOfStockCheckbox(prevState => !prevState);
              dispatchProductFilterOptions({
                type: 'UPDATE_OUTOFSTOCK_FILTER',
              });
            }}
            type="checkbox"
            checked={includeOutOfStockCheckbox}
          />
          <label htmlFor="out-of-stock-checkbox">Include out of stock products</label>
        </div>

        <div>
          <input
            id="fast-delivery-available-checkbox"
            value=""
            onChange={e => {
              setFastDeliveryOnlyCheckbox(prevState => !prevState);
              dispatchProductFilterOptions({
                type: 'UPDATE_FASTDELIVERY_FILTER',
              });
            }}
            type="checkbox"
            checked={fastDeliveryOnlyCheckbox}
          />
          <label htmlFor="fast-delivery-available-checkbox">Fast delivery only</label>
        </div>
      </div>
    </aside>
  );
}

export { Sidebar };

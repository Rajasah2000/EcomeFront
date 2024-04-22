import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
//import LibraryIllustration from "../..//Assets/Images/Library_Illustration_1.jpg"
import "./Home.css";
import jwt_decode from "jwt-decode";
import {
  GenreCard,
  NewArrivals,
  Footer,
  useWishlist,
  useCart,
} from "../../index.js";
import { useProductAvailable } from "../../Context/product-context";
import { useGenre } from "../../Context/genre-context";
import Banner from "../Banner/Banner";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AOS from "aos";
import "aos/dist/aos.css";
import Banner2 from "../Banner/Banner2";
import Helper from "../../AuthService/Helper.js";
const LibraryIllustration = require("../../Assets/Images/bookstore5.jpg");

function Home() {
  const { dispatchProductFilterOptions } = useProductAvailable();
  const { dispatchUserWishlist } = useWishlist();
  const { dispatchUserCart } = useCart();
  const navigate = useNavigate()
  const {
    setFictionCategoryCheckbox,
    setThrillerCategoryCheckbox,
    setTechCategoryCheckbox,
    setPhilosophyCategoryCheckbox,
    setRomanceCategoryCheckbox,
    setMangaCategoryCheckbox,
  } = useGenre();

  const { pathname } = useLocation();
  const [category, setCategory] = useState([]);
  const [trandingProduct, setTrendingProduct] = useState([]);
  console.log("category", trandingProduct);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  // Custom arrow component for "prev" button
  const CustomPrevArrow = (props) => {
    const { onClick } = props;
    return (
      <button className="custom-arrow custom-prev-arrow" onClick={onClick}>
        &#60;
      </button>
    ); // Unicode for "<"
  };

  // Custom arrow component for "next" button
  const CustomNextArrow = (props) => {
    const { onClick } = props;
    return (
      <button className="custom-arrow custom-next-arrow" onClick={onClick}>
        &#62;
      </button>
    ); // Unicode for ">"
  };

  const CustomNextArrow1 = (props) => {
    const { onClick } = props;
    return (
      <button className="custom-arrow custom-next-arrow1" onClick={onClick}>
        &#62;
      </button>
    ); // Unicode for ">"
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  const settingsCategory = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow1 />,
  };

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
          }
        })();
      }
    }
  }, []);

  // aos animation
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  //   Fetch All Category

  const fetchAllCategory = async () => {
    try {
      const res = await Helper(
        "http://localhost:3004/api/admin/get-all-category",
        "GET"
      );
      if (res && res?.status) {
        setCategory(res?.data);
      } else {
      }
    } catch (error) {
      console.log("err", error);
    }
  };

  const fetchAllTrendingProduct = async () => {
    try {
      const res = await Helper(
        "http://localhost:3004/api/admin/get-all-tranding-product",
        "GET"
      );
      if (res && res?.status) {
        console.log("fdfdsfsfds", res);
        setTrendingProduct(res?.data);
      } else {
      }
    } catch (error) {
      console.log("err", error);
    }
  };
  useEffect(() => {
    fetchAllCategory();
    fetchAllTrendingProduct();
  }, []);

  return (
    <div className="home-component-container">
      <Banner />
      <div style={{ margin: '2.4rem' }}>
        <img
          className="home-page-background-img"
          src="https://www.jiomart.com/images/cms/aw_rbslider/slides/1706772589_Home_and_Lifestyle_1240x209.jpg?im=Resize=(1240,150)"
          alt="Library Illustration"
        />
      </div>

      <h1 className="homepage-headings">Shop From Top Categories</h1>

      <div
        className="slider-container"
        data-aos="fade-up"
        data-aos-duration="3000"
        style={{ margin: '45px 45px', position: 'relative' }}
      >
        <Slider {...settingsCategory}>
          {category?.map(ele => {
            return (
              <div
                style={{ marginTop: '0px' }}
                onClick={() => {
                  navigate('/shop', { state: ele?._id });
                }}
              >
                <div>
                  <GenreCard genretype={ele?.name} image={ele?.image} />
                </div>
              </div>
            );
          })}
        </Slider>
      </div>

      <Link to={'/shop'}>
        <button
          onClick={() => {
            setFictionCategoryCheckbox(true);
            setThrillerCategoryCheckbox(true);
            setTechCategoryCheckbox(true);
            setPhilosophyCategoryCheckbox(true);
            setRomanceCategoryCheckbox(true);
            setMangaCategoryCheckbox(true);
            dispatchProductFilterOptions({ type: 'RESET_DEFAULT_FILTERS' });
          }}
          className="solid-secondary-btn homepage-explore-all-btn"
        >
          Explore All
        </button>
      </Link>

      <div>
        <h1
          className="homepage-headings"
          // style={{ padding: "2rem", backgroundColor: "#d4d5d6" }}
        >
          New Arrivals
        </h1>

        <div className="slider-container" data-aos="fade-up" data-aos-duration="3000">
          <Slider {...settings}>
            {trandingProduct?.map(ele => {
              return (
                <div style={{ marginTop: '12px' }}>
                  <Link
                    to={`/shop/`}
                    // onClick={() =>
                    // localStorage.setItem(`${_id}`, JSON.stringify(productdetails))
                    // }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="card-basic" style={{ borderRadius: '1rem', padding: '12px' }}>
                      <img src="https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1704795585/Croma%20Assets/Communication/Headphones%20and%20Earphones/Images/263445_0_uedz4h.png?tr=w-360" />

                      {/* <img src="https://www.mxdindia.com/public/uploads/images/1695224257650b11c1cc025.41_20230919_211536_0003.png" /> */}

                      <div className="card-item-details">
                        <div className="item-title">
                          <h4>{ele?.name}</h4>
                        </div>
                        <h5 className="item-author">{ele?.quantity} - &nbsp;Quantity</h5>
                        <p>
                          <b>Rs. {ele?.price} &nbsp;&nbsp;</b>
                          <del>Rs. 500</del> &nbsp;&nbsp;
                          <span className="discount-on-card">({ele?.percentOff}% off)</span>
                        </p>
                        <div className="card-button">
                          <button
                            onClick={event => {
                              event.preventDefault();
                              event.stopPropagation();
                              // addOrRemoveItemToWishlist();
                            }}
                            className={`card-icon-btn add-to-wishlist-btn outline-card-secondary-btn`}
                          >
                            <i className={`fa fa-x fa-heart-o`} aria-hidden="true"></i>
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
                  </Link>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>

      {/* <NewArrivals /> */}

      <div
        style={{
          backgroundColor: '#d4d5d6',
          margin: '1rem 6px',
          borderRadius: '7px',
        }}
      >
        <h1 className="homepage-headings" style={{ padding: '2rem', backgroundColor: '#d4d5d6' }}>
          Trending Smartphones
        </h1>
        <div className="slider-container" data-aos="fade-up" data-aos-duration="3000">
          <Slider {...settings}>
            {trandingProduct?.map(ele => {
              return (
                <div style={{ marginTop: '12px' }}>
                  <Link
                    to={`/shop/`}
                    // onClick={() =>
                    // localStorage.setItem(`${_id}`, JSON.stringify(productdetails))
                    // }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="card-basic" style={{ borderRadius: '1rem', padding: '12px' }}>
                      {/* <img src="https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1698384810/Croma%20Assets/Entertainment/Wireless%20Earbuds/Images/302477_wo2pp4.png" /> */}
                      <img src="https://m.media-amazon.com/images/I/61WjZrbnqML._SL1500_.jpg" />
                      <div className="card-item-details">
                        <div className="item-title">
                          <h4>{ele?.name}</h4>
                        </div>
                        <h5 className="item-author">{ele?.quantity} - &nbsp;Quantity</h5>
                        <p>
                          <b>Rs. {ele?.price} &nbsp;&nbsp;</b>
                          <del>Rs. 500</del> &nbsp;&nbsp;
                          <span className="discount-on-card">({ele?.percentOff}% off)</span>
                        </p>
                        <div className="card-button">
                          <button
                            onClick={event => {
                              event.preventDefault();
                              event.stopPropagation();
                              // addOrRemoveItemToWishlist();
                            }}
                            className={`card-icon-btn add-to-wishlist-btn outline-card-secondary-btn`}
                          >
                            <i className={`fa fa-x fa-heart-o`} aria-hidden="true"></i>
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
                  </Link>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>

      {/* Section  2 */}

      <div className="container">
        <div className="section1">
          <div className="image" data-aos="fade-right" data-aos-duration="3000">
            <img
              style={{ borderRadius: '12px' }}
              src="https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1711694916/Croma%20Assets/CMS/LP%20Page%20Banners/2024/New%20at%20Croma/March/29032024/HP_BigTile_NewAtCroma_cromaTWS1_28march2024_kqe3be.png?tr=w-1024"
            />
          </div>
          <div className="image" data-aos="fade-left" data-aos-duration="3000">
            <img
              style={{ borderRadius: '12px' }}
              src="https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1711950132/Croma%20Assets/CMS/LP%20Page%20Banners/2024/Sanity/HP/April/01042024/HP_BigTile_NewAtCroma_VivoT35G_1stapril2024_erwzwb.png?tr=w-1024"
            />
          </div>
        </div>
        <div className="section2" data-aos="fade-up" data-aos-duration="3000">
          <div className="image" data-aos="flip-left" data-aos-duration="3000">
            <img
              // data-aos="flip-left"
              style={{ borderRadius: '5px' }}
              src="https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1710312788/Croma%20Assets/CMS/LP%20Page%20Banners/2024/Sanity/HP/March/13032024/HP_4Split_NewAtCroma_BlaupunktSB_13March2024_l1qoer.png?tr=w-720"
            />
          </div>
          <div className="image" data-aos="flip-right" data-aos-duration="3000">
            <img
              style={{ borderRadius: '5px' }}
              src="https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1711603389/Croma%20Assets/CMS/LP%20Page%20Banners/2024/Sanity/HP/March/28032024/HP_4Split_NewAtCroma_NothingTWS_neckbands_28MArch2024_mkcgsy.png?tr=w-720"
            />
          </div>
          <div className="image" data-aos="flip-left" data-aos-duration="3000">
            <img
              style={{ borderRadius: '5px' }}
              src="https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1711603377/Croma%20Assets/CMS/LP%20Page%20Banners/2024/Sanity/HP/March/28032024/HP_4Split_audio_Marshall_28March2024_uuzru4.png?tr=w-480"
            />
          </div>
          <div className="image" data-aos="flip-right" data-aos-duration="3000">
            <img
              style={{ borderRadius: '5px' }}
              src="https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1710941197/Croma%20Assets/CMS/LP%20Page%20Banners/2024/BAU/HP_4Split_audio_JBL_20March2024_fl3y22.png?tr=w-480"
            />
          </div>
        </div>
      </div>

      {/* <NewArrivals /> */}
      <div
        style={{
          backgroundColor: '#d4d5d6',
          margin: '1rem 6px',
          borderRadius: '7px',
        }}
      >
        <h1 className="homepage-headings" style={{ padding: '2rem', backgroundColor: '#d4d5d6' }}>
          Deals on audio
        </h1>
        <div className="slider-container" data-aos="fade-up" data-aos-duration="3000">
          <Slider {...settings}>
            {trandingProduct?.map(ele => {
              return (
                <div style={{ marginTop: '12px' }}>
                  <Link
                    to={`/shop/`}
                    // onClick={() =>
                    // localStorage.setItem(`${_id}`, JSON.stringify(productdetails))
                    // }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="card-basic" style={{ borderRadius: '1rem', padding: '12px' }}>
                      <img src="https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1632902449/Croma%20Assets/Entertainment/Headphones%20and%20Earphones/Images/243163_jlfkhe.png?tr=w-360" />
                      <div className="card-item-details">
                        <div className="item-title">
                          <h4>{ele?.name}</h4>
                        </div>
                        <h5 className="item-author">{ele?.quantity} - &nbsp;Quantity</h5>
                        <p>
                          <b>Rs. {ele?.price} &nbsp;&nbsp;</b>
                          <del>Rs. 500</del> &nbsp;&nbsp;
                          <span className="discount-on-card">({ele?.percentOff}% off)</span>
                        </p>
                        <div className="card-button">
                          <button
                            onClick={event => {
                              event.preventDefault();
                              event.stopPropagation();
                              // addOrRemoveItemToWishlist();
                            }}
                            className={`card-icon-btn add-to-wishlist-btn outline-card-secondary-btn`}
                          >
                            <i className={`fa fa-x fa-heart-o`} aria-hidden="true"></i>
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
                  </Link>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>

      {/* <NewArrivals /> */}

      <h1 className="homepage-headings" style={{ margin: '4rem' }}>
        Best Selling Product
      </h1>
      <div className="slider-container" data-aos="fade-up" data-aos-duration="3000">
        <Slider {...settings}>
          {trandingProduct?.map(ele => {
            return (
              <div style={{ marginTop: '12px' }}>
                <Link
                  to={`/shop/`}
                  // onClick={() =>
                  // localStorage.setItem(`${_id}`, JSON.stringify(productdetails))
                  // }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="card-basic" style={{ borderRadius: '1rem', padding: '12px' }}>
                    <img src="https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1697016359/Croma%20Assets/Entertainment/Wireless%20Earbuds/Images/300117_0_rlzacv.png?tr=w-400" />
                    <div className="card-item-details">
                      <div className="item-title">
                        <h4>{ele?.name}</h4>
                      </div>
                      <h5 className="item-author">{ele?.quantity} - &nbsp;Quantity</h5>
                      <p>
                        <b>Rs. {ele?.price} &nbsp;&nbsp;</b>
                        <del>Rs. 500</del> &nbsp;&nbsp;
                        <span className="discount-on-card">({ele?.percentOff}% off)</span>
                      </p>
                      <div className="card-button">
                        <button
                          onClick={event => {
                            event.preventDefault();
                            event.stopPropagation();
                            // addOrRemoveItemToWishlist();
                          }}
                          className={`card-icon-btn add-to-wishlist-btn outline-card-secondary-btn`}
                        >
                          <i className={`fa fa-x fa-heart-o`} aria-hidden="true"></i>
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
                </Link>
              </div>
            );
          })}
        </Slider>
      </div>

      {/* <NewArrivals /> */}

      <Footer />
    </div>
  );
}

export { Home };

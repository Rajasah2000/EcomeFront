import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import HttpClient from "../../utils/HttpClient";

function Banner2() {
//   const [banner, setBanner] = useState([]);
  var settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

//   useEffect(() => {
//     getBanner();
//   }, []);
//   async function getBanner() {
//     let result = await HttpClient.requestDataforAdmin("ecom_banner/", "GET");
//     // console.log(result.data)
//     if (result && result.status) {
//       setBanner(result.data);
//     }
//   }
  return (
    <>
      {/* <div class="banner" style={{ backgroundImage: `url(${banner})` }}>
        <div className="overlay"></div>
        <div class="container-fluid">
          <div class="row   ">
            <div className="slider-content slider-content-bg text-start  center-left">
              <div className="slide_1">
                <h2
                  className="slide-heading animated"
                  style={{ color: "#ffffff" }}
                >
                  Stylish wireless <br /> on‑ear headphones
                </h2>
                <div
                  className="slide-text animated"
                  style={{ color: "#ffffff" }}
                >
                  Fine quality <br /> wireless headphones to stay inspired
                </div>
                <div className="multiple-buttons">
                  <span className="price animated">$100</span>
                  <a
                    href="/collections/best-sellers"
                    className="slide-button dt-sc-btn animated"
                  >
                    Order Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="banner" style={{ backgroundImage: `url(${banner2})` }}>
        <div className="overlay"></div>
        <div class="container-fluid">
          <div class="row   ">
            <div className="slider-content slider-content-bg text-start  center-left">
              <div className="slide_1">
                <h2
                  className="slide-heading animated"
                  style={{ color: "#ffffff" }}
                >
                  Stylish wireless <br /> on‑ear headphones
                </h2>
                <div
                  className="slide-text animated"
                  style={{ color: "#ffffff" }}
                >
                  Fine quality <br /> wireless headphones to stay inspired
                </div>
                <div className="multiple-buttons">
                  <span className="price animated">$100</span>
                  <a
                    href="/collections/best-sellers"
                    className="slide-button dt-sc-btn animated"
                  >
                    Order Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <section className="main_banner_area" style={{ marginTop:"1.3rem"}}>
        <Slider {...settings}>
          {/* {banner.map((item) => {
            return ( */}
              <div className="banner_img_area" key="1" style={{ borderRadius:"2rem" , margin:"1rem"}}>
                <img src="https://www.jiomart.com/images/cms/aw_rbslider/slides/1706730448_Simple_1st-Offer_1240x209.jpg?im=Resize=(1241,195)" className="img-fluid" alt="banner" />
              </div>
              <div className="banner_img_area" key="2" style={{ borderRadius:"2rem" , margin:"1rem"}}>
                <img src="https://www.jiomart.com/images/cms/aw_rbslider/slides/1706104575_1240x209.jpg?im=Resize=(1241,195)" className="img-fluid" alt="banner" />
              </div>
              <div className="banner_img_area" key="3" style={{ borderRadius:"2rem" , margin:"1rem"}}>
                <img src="https://www.jiomart.com/images/cms/aw_rbslider/slides/1706730191_AU_Bank_1240x209.jpg?im=Resize=(1241,195)" className="img-fluid" alt="banner" />
              </div>
              <div className="banner_img_area" key="3" style={{ borderRadius:"2rem" , margin:"1rem"}}>
                <img src="https://www.jiomart.com/images/cms/aw_rbslider/slides/1706730374_TWID_New_1240x209.jpg?im=Resize=(1241,195)" className="img-fluid" alt="banner" />
              </div>
           
              <div className="banner_img_area" key="3" style={{ borderRadius:"2rem" , margin:"1rem"}}>
                <img src="https://www.jiomart.com/images/cms/aw_rbslider/slides/1706730448_Simple_1st-Offer_1240x209.jpg?im=Resize=(1241,195)" className="img-fluid" alt="banner" />
              </div>
              <div className="banner_img_area" key="3" style={{ borderRadius:"2rem" , margin:"1rem"}}>
                <img src="https://www.jiomart.com/images/cms/aw_rbslider/slides/1696077709_1683628499_JioPlus_1240x209web.jpg?im=Resize=(1241,195)" className="img-fluid" alt="banner" />
              </div>
            {/* );
          })} */}
          {/* <div className="banner_img_area">
            <img src={bannerimg2} className="img-fluid" alt="banner" />
          </div> */}
        </Slider>
      </section>
    </>
  );
}

export default Banner2;

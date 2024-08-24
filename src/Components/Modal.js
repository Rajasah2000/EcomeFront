import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useToast } from '../Context/toast-context';
import logo from '../Assets/Images/logo1.jpeg'
import Helper from '../AuthService/Helper';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../ContextSetup/ContextProvider';

export default function Modal({ setModalIsOpen, finalBill, cartData }) {
  console.log('jkhhhsdhfurfrhheru', finalBill, cartData);
    const { fetchAllWishlistData, getAllCartData, getAllOrderData } = useUserContext();
  const QRCode = require('qrcode');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  // const [nearestStation, setNearestStation] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const userId = localStorage.getItem('Id');
  const { showToast } = useToast();
  const [qr, setqr] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    let OrderData = []
    cartData?.forEach((ele) => {
      OrderData?.push({
        productId: ele?.CartProductdata?._id,
        quantity: ele?.quantity,
      });
    });

    let data = {
      user_id: userId,
      items: OrderData,
      userName: name,
      phoneNumber: phoneNumber,
      postalCode: postalCode,
      address: address,
      paymentMode: paymentMode,
      totalAmount: finalBill,
    };
    if (name && phoneNumber && postalCode && address && paymentMode) {
      if (paymentMode === 'cod') {
        let res =await Helper('http://localhost:3004/api/admin/create-order', 'POST', data);
        if(res && res?.status) {
          console.log("hjhsduhjdshfjhsdfuufwueuioweur", res);
          
          showToast('success', '', res?.message);
          setModalIsOpen(false);
          fetchAllWishlistData(userId);
          getAllCartData();
          getAllOrderData(userId);
          // window.location.reload(true);
          navigate('/orders');
        }else{
          showToast('error', '', res?.message);
        }
        
      }
      if (paymentMode === 'online') {
        let qrlink = await generateUPIQRCode('ruzan.care@oksbi', 'RUZAN', finalBill);
        setqr(qrlink);
      }
      // setModalIsOpen(false);
    } else {
      showToast('error', '', 'Please ensure all fields are filled out correctly.');
    }

    // Add your form submission logic here
  };

   const handleSubmit1 = async e => {
     e.preventDefault();
     let OrderData = [];
     cartData?.forEach(ele => {
       OrderData?.push({
         productId: ele?.CartProductdata?._id,
         quantity: ele?.quantity,
       });
     });

     let data = {
       user_id: userId,
       items: OrderData,
       userName: name,
       phoneNumber: phoneNumber,
       postalCode: postalCode,
       address: address,
       paymentMode: paymentMode,
       totalAmount: finalBill,
     };
     if (name && phoneNumber && postalCode && address && paymentMode) {
       if (paymentMode === 'online') {
         let res = await Helper('http://localhost:3004/api/admin/create-order', 'POST', data);
         if (res && res?.status) {
           showToast('success', '', 'Payment is under process and wait for admin verification.');
           showToast('success', '', res?.message);
           setModalIsOpen(false);
           fetchAllWishlistData(userId);
           getAllCartData();
           getAllOrderData(userId);
           // window.location.reload(true);
           navigate('/orders');
         } else {
           showToast('error', '', res?.message);
         }
       }
      //  if (paymentMode === 'online') {
      //    let qrlink = await generateUPIQRCode('ruzan.care@oksbi', 'RUZAN', finalBill);
      //    setqr(qrlink);
      //  }
       // setModalIsOpen(false);
     } else {
       showToast('error', '', 'Please ensure all fields are filled out correctly.');
     }

     // Add your form submission logic here
   };

  const generateUPIQRCode = async (upiId, payeeName, amount) => {
    // Correct UPI URL format
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;

    try {
      // Generate the QR code from the UPI link
      const qrCodeDataUrl = await QRCode.toDataURL(upiLink);
      return qrCodeDataUrl;
      //  setQRCodeSrc(qrCodeDataUrl);
    } catch (err) {
      console.error('Error generating QR code', err);
    }
  };
  const paymentMethod = async e => {
    setPaymentMode(e.target.value);
  };

  // Example usage:

  return (
    <div
      className="modal fade show"
      role="dialog"
      tabIndex={-1}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="modal-dialog" role="document">
        <button
          className="btn-close"
          style={{
            position: 'absolute',
            top: '15px',
            right: '-103px',
            zIndex: '1',
            cursor: 'pointer',
          }}
          onClick={() => setModalIsOpen(false)}
        >
          ✕
        </button>
        <div
          className="modal-content"
          style={{
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
            position: 'relative',
          }}
        >
          <div className="modal-header">
            <h4 className="modal-title" style={{ margin: '11px 5px' }}>
              Checkout
            </h4>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label
                    htmlFor="name"
                    className="form-label"
                    style={{
                      fontSize: '12px',
                      display: 'block',
                      marginBottom: '5px',
                      marginLeft: '0px', // Ensure the label is aligned with the input
                      paddingLeft: '0px', // Remove any padding that might shift the label
                    }}
                  >
                    Name :
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="form-control"
                    placeholder="Enter your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      marginBottom: '7px',
                    }}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label
                    htmlFor="phoneNumber"
                    className="form-label"
                    style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}
                  >
                    Phone Number :
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    className="form-control"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      marginBottom: '7px',
                    }}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label
                    htmlFor="postalCode"
                    className="form-label"
                    style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}
                  >
                    Postal Code :
                  </label>
                  <input
                    id="postalCode"
                    type="text"
                    className="form-control"
                    placeholder="Enter your postal code"
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      marginBottom: '7px',
                    }}
                  />
                </div>
              </div>

              <div className="col-md-12">
                <div className="mb-3">
                  <label
                    htmlFor="address"
                    className="form-label"
                    style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}
                  >
                    Address :
                  </label>
                  <textarea
                    id="address"
                    className="form-control"
                    placeholder="Enter your address"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      marginBottom: '7px',
                    }}
                  ></textarea>
                </div>
              </div>

              <div className="col-md-12">
                <div className="mb-3">
                  <label
                    htmlFor="paymentMode"
                    className="form-label"
                    style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}
                  >
                    Payment Mode :
                  </label>
                  <select
                    id="paymentMode"
                    className="form-control"
                    value={paymentMode}
                    onChange={paymentMethod}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      marginBottom: '0px',
                    }}
                  >
                    <option value="">Select</option>
                    <option value="online">Online</option>
                    <option value="cod">Cash on Delivery</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button
              type="button"
              className="btn btn-link"
              onClick={() => {
              setModalIsOpen(false);
              }}
              style={{
                padding: '10px 20px',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: '#ccc',
                color: '#333',
                border: 'none',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              style={{
                padding: '10px 20px',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {paymentMode === 'online' && (
        <div
          style={{
            position: 'fixed',
            top: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          {qr && (
            <div
              style={{
                maxWidth: '230px',
                margin: '15px 12px',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                backgroundColor: '#fff',
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif',
              }}
            >
              <div style={{ marginBottom: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={logo}
                  style={{
                    width: '32px',
                    height: '32px',
                    marginRight: '10px',
                    borderRadius: '50%', // Makes the image circular
                    objectFit: 'cover', // Ensures the image covers the area without distortion
                  }}
                  alt="Logo"
                />
                <h2 style={{ fontSize: '2.5rem', color: '#333', margin: 0 }}>RUZAN</h2>
              </div>
              {/* <div> */}
              <h1 style={{ fontSize: '2.7rem', color: '#333' }}>{finalBill}</h1>
              {/* </div> */}
              <div style={{ marginBottom: '-20px' }}>
                <img src={qr} alt="UPI QR Code" style={{ width: '280px', height: 'auto' }} />
              </div>
              <div style={{ marginTop: '10px' }}>
                <p style={{ fontSize: '1.3rem', color: '#555' }}>UPI ID : ruzan.care@oksbi</p>
                <button
                  style={{
                    backgroundColor: '#4CAF50', // Green color for the button
                    color: 'white', // Text color
                    padding: '5px 10px', // Padding for the button
                    fontSize: '16px', // Font size of the button text
                    fontWeight: 'bold', // Make the text bold
                    borderRadius: '8px', // Rounded corners
                    border: 'none', // No border
                    boxShadow: '0 4px #2d6b3d', // 3D shadow effect
                    cursor: 'pointer', // Change cursor to pointer on hover
                    transition: 'transform 0.2s ease-in-out', // Smooth transition for button press effect
                  }}
                  onClick={handleSubmit1}
                  onMouseDown={e => (e.currentTarget.style.transform = 'translateY(4px)')}
                  onMouseUp={e => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {' '}
                  After payment Proceed to Orders
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

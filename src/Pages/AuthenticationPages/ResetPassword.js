// // import toast from 'react-hot-toast';
// // import '../AdminAuthentication/ResetPassword.css'
// import React, { useState } from 'react';
// import {useNavigate, useParams} from 'react-router-dom'
// // import Helpers from '../Utils/Helpers';
// import Helper from '../../AuthService/Helper';

// const ResetPassword = () => {

//   return (
//     <div className="modal fade show" role="dialog" tabIndex={-1}>
//       <div className="modal-dialog" role="document">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">Reset Password</h5>
//           </div>
//           <div className="modal-body">
//             <div className="row">
//               <div className="col-md-6d">
//                 <div className="mb-3">
//                   <label htmlFor="examplePassword11" className="form-label">
//                     New Password
//                   </label>
//                   <input
//                     name="password"
//                     id="examplePassword11"
//                     placeholder="Enter new password"
//                     type="password"
//                     className="form-control"
//                     value={password}
//                     onChange={handlePasswordChange}
//                   />
//                 </div>
//               </div>

//               <div className="col-md-">
//                 <div className="mb-6">
//                   <label htmlFor="examplePassword11" className="form-label">
//                     Confirm Password
//                   </label>
//                   <input
//                     name="password"
//                     id="examplePassword11"
//                     placeholder="Enter confirm password"
//                     type="password"
//                     className="form-control"
//                     value={confirmPassword}
//                     onChange={handleConfirmPasswordChange}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="modal-footer">
//             <button type="button" className="btn btn-primary" onClick={ResetPassword}>
//               Submit
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;

import React, { useState, useEffect } from "react";
import "./UserAuth.css";
import { Link, useNavigate, useParams } from "react-router-dom";

import Helper from "../../AuthService/Helper";
import { useToast } from "../../Context/toast-context";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();
  console.log("token", token);
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const ResetPassword = async (e) => {
    e.preventDefault();

    // Simple password validation

    if (password == "" || confirmPassword == "") {
      showToast("error", "", "All fields are required");
      //   toast.error("All fields are required");
      return;
    }

    // Password length validation
    if (password.length < 6 || confirmPassword.length < 6) {
      showToast("error", "", "Password must be at least 6 characters long");
      //   toast.error('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      showToast("error", "", "Passwords don't match");
      //   toast.error("Passwords don't match");
      return;
    }

    try {
      let data = {
        newPassword: password,
      };

      const res = await Helper(
        `http://localhost:3004/api/admin//reset-password/${token}`,
        "POST",
        data
      );
      if (res && res?.status) {
        //   toast.success(res?.message);
        showToast("success", "", res?.message);
        setPassword("");
        setConfirmPassword("");
        navigate("/login");
      } else {
        showToast("error", "", res?.message);
        //   toast.error(res?.message);
      }
    } catch (error) {
      console.error(error);
    }

    // Clear form fields and error message on successful password reset
    setPassword("");
    setConfirmPassword("");
  };
  return (
    <>
      <div className="user-auth-content-container">
        <form onSubmit={ResetPassword} className="user-auth-form">
          <h2>Reset-Password</h2>

          <div className="user-auth-input-container">
            <label htmlFor="user-auth-input-email">
              <h4>New Password</h4>
            </label>
            <input
              id="user-auth-input-email"
              className="user-auth-form-input"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={handlePasswordChange}
              // required
            />
          </div>

          <div className="user-auth-input-container">
            <label htmlFor="user-auth-input-password">
              <h4>Confirm Password</h4>
            </label>
            <input
              id="user-auth-input-password"
              className="user-auth-form-input"
              type="password"
              placeholder="Enter confirm password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              // required
            />
          </div>

          <button
            type="submit"
            className="solid-success-btn form-user-auth-submit-btn"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default ResetPassword;

import React, { useState } from "react"
import "./UserAuth.css"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useToast } from "../../Context/toast-context"
import Helper from "../../AuthService/Helper"

function Signup()
{
    const { showToast } = useToast()

    const [termsAndConditionsCheckbox, setTermsAndConditionsCheckbox] = useState(false)
    const [newUserName     , setNewUserName]     = useState('')
    const [newUserEmail    , setNewUserEmail]    = useState('')
    const [newUserPassword , setNewUserPassword] = useState('')
    const [mobile , setMobileNumber] = useState("")

    const navigate = useNavigate()

    // function signupUser(event)
    // {
    //     event.preventDefault();
    //     axios.post(
    //         "https://bookztron-server.vercel.app/api/signup",
    //         {
    //             newUserName: `${newUserName}`,
    //             newUserEmail: `${newUserEmail}`,
    //             newUserPassword : `${newUserPassword}`
    //         }
    //     )
    //     .then(res => {
    //         if(res.data.status==='ok')
    //         {
                // //User created successfully, navigate to Login Page
                // showToast("success","","New user created successfully")
                // navigate('/login')
    //         }
    //         else
    //         {
    //             throw new Error("Error occured while creating new user")
    //         }
    //     })
    //     .catch(err=>{
    //         showToast("error","","Error creating new user. Please try again")
    //     })
    // }

    const signupUser = async(event) => {
      
      event.preventDefault();
      if(newUserName && newUserEmail && newUserPassword && mobile){
        let data = {
          firstname: newUserName,
          lastname: 'a',
          email: newUserEmail,
          password: newUserPassword,
          mobile: mobile,
          role: 'user',
        };
         try {
      const res = await Helper('http://localhost:3004/api/admin/register', 'POST' ,data);
      if (res && res?.status) {
        //User created successfully, navigate to Login Page
        setMobileNumber("");
        setNewUserEmail("");
        setNewUserName("");
        setNewUserPassword("");
        showToast('success', '', 'New user created successfully');
        navigate('/login');
      } else {
        showToast('error', '', res?.msg);
      }
    } catch (error) {
      console.log("err", error);
    }
      }else{
        showToast('error', '', 'All Fields are required!');
      }
    }

    return (
      <div className="user-auth-content-container">
        <form onSubmit={signupUser} className="user-auth-form">
          <h2>Signup</h2>

          <div className="user-auth-input-container">
            <label htmlFor="user-auth-input-name">
              <h4>Name </h4>
            </label>
            <input
              id="user-auth-input-name"
              className="user-auth-form-input"
              type="text"
              placeholder="Name"
              value={newUserName}
              onChange={event => setNewUserName(event.target.value)}
              // required
            />
          </div>

          <div className="user-auth-input-container">
            <label htmlFor="user-auth-input-email">
              <h4>Email address</h4>
            </label>
            <input
              id="user-auth-input-email"
              className="user-auth-form-input"
              type="email"
              placeholder="Email"
              value={newUserEmail}
              onChange={event => setNewUserEmail(event.target.value)}
              // required
            />
          </div>

          <div className="user-auth-input-container">
            <label htmlFor="user-auth-input-email">
              <h4>Mobile</h4>
            </label>
            <input
              id="user-auth-input-email"
              className="user-auth-form-input"
              type="number"
              placeholder="Mobile number"
              value={mobile}
              onChange={event => setMobileNumber(event.target.value)}
              // required
            />
          </div>

          <div className="user-auth-input-container">
            <label htmlFor="user-auth-input-password">
              <h4>Password</h4>
            </label>
            <input
              id="user-auth-input-password"
              className="user-auth-form-input"
              type="password"
              placeholder="Password"
              value={newUserPassword}
              onChange={event => setNewUserPassword(event.target.value)}
              // required
            />
          </div>

          {/* <div className="accept-terms-container">
            <input
              type="checkbox"
              id="accept-terms"
              checked={termsAndConditionsCheckbox}
              onChange={() => setTermsAndConditionsCheckbox(prevState => !prevState)}
            />
            <label htmlFor="accept-terms">I accept all terms and conditions</label>
          </div> */}

          <button
            type="submit"
            className="solid-success-btn form-user-auth-submit-btn"
            // disabled={termsAndConditionsCheckbox ? '' : true}
          >
            Create New Account
          </button>

          <div className="existing-user-container">
            <Link to="/login" className="links-with-blue-underline existing-user-link" id="existing-user-link">
              Already have an account &nbsp;
            </Link>
          </div>
        </form>
      </div>
    );
}

export { Signup }
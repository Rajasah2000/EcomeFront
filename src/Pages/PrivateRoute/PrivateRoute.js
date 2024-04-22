import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = () => {
 const Status = localStorage.getItem("status")
  return (
   
        Status ? <Outlet/> : <Navigate to={"/login"} />
     
  )
}

export default PrivateRoute
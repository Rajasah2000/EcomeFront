import React from 'react';
import { Circles } from 'react-loader-spinner';
const PageLoader = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
      }}
    >
      <Circles
        height="100"
        width="100"
        // color="#4fa94d"
        color="grey"
        ariaLabel="circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
};

export default PageLoader;

import React, { useState, useEffect } from 'react';

// import App from './App';
import PageLoader from './PageLoader';
import App from '../../App';

const AppWithLoader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate data fetching (replace with actual data fetching logic)
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a 2-second fetch
      setLoading(false);
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once when the component mounts


  if (loading) {
    return <PageLoader />;
  }

  return <App />;
};

export default AppWithLoader;

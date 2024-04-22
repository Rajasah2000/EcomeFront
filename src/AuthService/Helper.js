import React from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';

async function Helper(url, method = 'GET', data = null, headers = {}) {
  try {
    let token = reactLocalStorage.get('token');
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers, // Merge custom headers
      },
      body: data ? JSON.stringify(data) : null,
    };

    const response = await fetch(url, options);
    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.log(error);
  }
}

export default Helper;

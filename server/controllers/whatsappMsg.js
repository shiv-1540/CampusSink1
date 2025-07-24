// Ensure you have installed axios package
// npm install axios or yarn add axios

const axios = require('axios');

const url = 'https://api.wassenger.com/v1/messages';
const apiKey = 'YOUR_ACTUAL_API_KEY';
const phone = '+918007001540';
const message = 'Hello world, this is a sample message';

const options = {
  method: 'POST',
  url: url,
  headers: {
    'Content-Type': 'application/json',
    'Token': apiKey
  },
  data: {
    phone: phone,
    message: message
  }
};

axios.request(options)
  .then(function (response) {
    console.log('Message sent successfully.');
    console.log('Response:', response.data);
  })
  .catch(function (error) {
    if (error.response) {
      console.error('Error:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
  });

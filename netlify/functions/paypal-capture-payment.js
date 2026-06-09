const axios = require('axios');

const PAYPAL_API_KEY = process.env.PAYPAL_API_KEY || 'BAASxaYDg9DzaVHSia8h5uYAEtsdGR6528s81GUBgmK1pzHDHQRC1HfQ-eMyi8qpGbh3U-DnuhSOPeMbmk';
const PAYPAL_SECRET_KEY = process.env.PAYPAL_SECRET_KEY || 'EG0EtpuLbITRsQFpm43qblJkjrjaGXsb5eD8J5Lf0MFMu9qK2osXvnGhyZd_yA-ErhXv02LolO4a4fKL';

const PAYPAL_BASE_URL = process.env.PAYPAL_ENV === 'live' 
  ? 'https://api.paypal.com' 
  : 'https://api.sandbox.paypal.com';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { orderID } = JSON.parse(event.body);

    if (!orderID) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Order ID is required' }) 
      };
    }

    const auth = Buffer.from(`${PAYPAL_API_KEY}:${PAYPAL_SECRET_KEY}`).toString('base64');
    
    const tokenResponse = await axios.post(
      `${PAYPAL_BASE_URL}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const captureResponse = await axios.post(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const captureData = captureResponse.data;
    const isCompleted = captureData.status === 'COMPLETED' || 
      captureData.purchase_units?.[0]?.payments?.captures?.[0]?.status === 'COMPLETED';

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: isCompleted,
        status: captureData.status,
        captureID: captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id,
        details: captureData
      })
    };
  } catch (error) {
    console.error('PayPal Capture Error:', error.response?.data || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to capture PayPal payment' })
    };
  }
};
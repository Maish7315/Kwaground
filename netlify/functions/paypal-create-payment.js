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
    const { amount, description } = JSON.parse(event.body);

    if (!amount) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Amount is required' }) 
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

    const origin = event.headers.origin || event.headers.referer?.replace(/\/$/, '') || 'http://localhost:3000';
    
    const paymentResponse = await axios.post(
      `${PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: (amount / 130).toFixed(2)
          },
          description: description || 'KwaGround Premium Job Payment'
        }],
        application_context: {
          brand_name: 'KwaGround',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          return_url: `${origin}/payment-success`,
          cancel_url: `${origin}/payment-cancelled`
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        orderID: paymentResponse.data.id,
        approveUrl: paymentResponse.data.links.find(l => l.rel === 'approve')?.href
      })
    };
  } catch (error) {
    console.error('PayPal Error:', error.response?.data || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create PayPal payment' })
    };
  }
};
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const CONSUMER_KEY = 'G7c6FQc5PxRW8jrwTlWkFJ5C6xh8nTgv';
const CONSUMER_SECRET = 'F3OLwQXjPpJW8EwV';
const SHORTCODE = '174379';
const PASSKEY = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
const BASE_URL = 'https://sandbox.safaricom.co.ke';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { phone, amount } = await req.json();

    if (!phone || !amount) {
      return new Response(JSON.stringify({ error: 'Phone and amount required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get access token
    const auth = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
    const tokenResponse = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Generate timestamp
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:-]/g, '').slice(0, 14);

    // Generate password
    const password = btoa(SHORTCODE + PASSKEY + timestamp);

    // Prepare STK push payload
    const stkPayload = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount.toString(),
      PartyA: phone.startsWith('254') ? phone : `254${phone.slice(1)}`,
      PartyB: SHORTCODE,
      PhoneNumber: phone.startsWith('254') ? phone : `254${phone.slice(1)}`,
      CallBackURL: `${req.headers.get('origin') || 'http://localhost:3000'}/api/mpesa-callback`,
      AccountReference: 'Kwaground Premium Job',
      TransactionDesc: 'Premium Job Posting Payment',
    };

    // Initiate STK push
    const stkResponse = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPayload),
    });

    if (!stkResponse.ok) {
      throw new Error('Failed to initiate STK push');
    }

    const stkData = await stkResponse.json();

    return new Response(JSON.stringify(stkData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
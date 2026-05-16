exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const data = JSON.parse(event.body);
  console.log('M-Pesa Callback Received:', JSON.stringify(data, null, 2));

  // TODO: Update Supabase record using the callback data

  return {
    statusCode: 200,
    body: JSON.stringify({ ResultCode: 0, ResultDesc: 'Accepted' })
  };
};

const { createClient } = require("faunadb");
const faunadb = require("faunadb");
const q = faunadb.query;

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const client = createClient({
    secret: process.env.FAUNA_SECRET_KEY,
  });

  try {
    const data = JSON.parse(event.body);
    
    // Calculate profit margin
    data.profitMargin = ((data.dailyRevenue - data.dailyCosts) / data.dailyRevenue * 100);
    data.submissionDate = new Date().toISOString();
    
    const result = await client.query(
      q.Create(
        q.Collection("scores"),
        { data }
      )
    );

    return {
      statusCode: 201,
      body: JSON.stringify({ success: true, id: result.ref.id })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
const { createClient } = require("faunadb");
const faunadb = require("faunadb");
const q = faunadb.query;

exports.handler = async function(event, context) {
  const client = createClient({
    secret: process.env.FAUNA_SECRET_KEY,
  });

  try {
    const sortBy = event.queryStringParameters?.sortBy || "cash";
    
    const result = await client.query(
      q.Map(
        q.Paginate(
          q.Documents(q.Collection("scores")),
          { size: 10 }
        ),
        q.Lambda("ref", q.Get(q.Var("ref")))
      )
    );

    // Extract and sort data
    let scores = result.data.map(item => item.data);
    
    // Sort by the specified field in descending order
    scores.sort((a, b) => b[sortBy] - a[sortBy]);
    
    return {
      statusCode: 200,
      body: JSON.stringify(scores)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
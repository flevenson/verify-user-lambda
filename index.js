const pg = require('pg');

const databaseUser = process.env.DB_USER;
const databasePassword = process.env.DB_PASSWORD;
const databaseName = process.env.DB_NAME;
const databaseHost = process.env.DB_HOST;
const databasePort = process.env.DB_PORT;
const databaseMaxCon = process.env.DB_MAX_CONNECTIONS;

exports.handler = async (event, context, callback) => {
  
  console.log('Received Event');

  const dbConfig = {
    user: databaseUser,
    password: databasePassword,
    database: databaseName,
    host: databaseHost,
    port: databasePort,
    max: databaseMaxCon
  };

  const text = 'SELECT user_token FROM users WHERE username=$1 AND password=$2'
  const values = [event.username, event.password]


  const pool = new pg.Pool(dbConfig);
  let client, result;

  try{
    client = await pool.connect();
    console.log('Connection Established');
  } catch(err) {
    console.log('Error connecting to PG Server' + err.stack);
  }

  try {
    result = await client.query(text, values);
    result = result.rows[0];
    console.log(result);
  } catch(err) {
    console.log('Error querying DB');
    console.log(err.stack);
  } 

  if(result){
    return result;
  }


  client.release();
  pool.end();

  console.log('Ending Lambda');

}

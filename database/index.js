const { Client } = require('pg');
const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "password",
  database: "learning_pod",
});
client.connect();

const getUserInfo = (userType, firstName, lastName) => {
  const sql = `SELECT * FROM ${userType} WHERE firstName=${firstName} AND lastName=${lastName}`;
  client.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    }
    return results;
  });
};

module.exports.connection = client;
module.exports.getUserInfo = getUserInfo;

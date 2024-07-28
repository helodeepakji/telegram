const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: '13.233.59.56', // Database host
  user: 'remoteroot', // Database username
  password: 'Root@2024', // Database password
  database: 'telegram', // Database name
  port: 3306 // Database port
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as ID', connection.threadId);
});

// Export the connection
module.exports = connection;

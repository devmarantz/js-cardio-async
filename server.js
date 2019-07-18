const http = require('http'); // import HTTP node module
const { handleRoutes } = require('./router'); //import our router

const server = http.createServer(); // Creates the server

// Listens for the "request" event on or server
// The event will be fired anytime some client makes a request
// Take a callback with request and response
// request is what the client sends to us
// response is what we send back
server.on('request', handleRoutes);

// opens our server up on port 5000 for connections
server.listen(5000, () => console.log('Server listening on port 5000'));

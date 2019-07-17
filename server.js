const http = require('http');

const server = http.createServer();

// Listens for the "request" event on or server
// The event will be fired anytime some client makes a request
// Take a callback with request and response
// request is what the client sends to us
// response is what we send back
server.on('request', (req, res) => {
  // check if request was a GET to '/' route
  if (req.url === '/' && req.method === 'GET') {
    // sets the status code and writes the header
    res.writeHead(200, {
      'My-custom-header': 'This is a great API',
      'Another header': 'More meta data',
    });
    res.end('Welcome to my server!');
    return;
  }

  if (req.url === '/status' && req.method === 'GET') {
    const status = {
      up: true,
      owner: 'Andrew Maney',
      timestamp: Date.now(),
    };
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Another-Header': 'more things',
    });
    res.end(JSON.stringify(status));
  }
});

server.listen(5000, () => console.log('Server listening on port 5000'));

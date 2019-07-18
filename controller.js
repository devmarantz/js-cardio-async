const fs = require('fs').promises;
const db = require('./db'); // import our database

exports.notFound = async (req, res) => {
  const html = await fs.readFile('404.html');
  // handle any unfound errors
  res.writeHead(404, {
    'Content-Type': 'text/html',
  });
  res.end(html);
};

exports.getHome = (req, res) => {
  // sets the status code and writes the header
  res.writeHead(200, {
    'My-custom-header': 'This is a great API',
    'Another-header': 'More meta data',
  });
  // sending the the response to the client with data
  res.end('Welcome to my server!');
  // res.end();
};

exports.getStatus = (req, res) => {
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
};

exports.patchSet = (req, res, { file, key, value }) => {
  // check if the file, key, and value are all defined
  if (!file || !key || !value) {
    res.writeHead(400);
    res.end('File, Key, and Value queries are required');
  }
  // fire off the db set method
  db.set(file, key, value)
    .then(() => {
      res.writeHead(200);
      res.end('Value Set');
    })
    .catch(err => {
      res.writeHead(400, {
        'Content-Type': 'text/html',
      });
      res.end(err.message);
    });
};

exports.postWrite = (req, res, pathname) => {
  // 1. Get the body data from the request
  const data = [];
  // event emitted when the request receives a chunk of data
  req.on('data', chunk => data.push(chunk));
  // event emitted when the request has received all of the data
  req.on('end', async () => {
    // parse our data array
    const body = JSON.parse(data);
    await db.createFile(pathname.split('/')[2], body);
    res.writeHead(201, {
      'Content-Type': 'text/html',
    });
    // returns a response
    res.end('File written');
  });
};

exports.getFile = (req, res, pathname) => {
  // event emitted when the request has received all of the data
  // req.on('end', async () => {
  // parse our data array
  db.getFile(pathname.split('/')[2])
    .then(body => {
      res.writeHead(200, {
        'Content-Type': 'application/json',
      });
      res.end(body);
    })
    .catch(err => {
      res.writeHead(400, {
        'Content-Type': 'text/html',
      });
      res.end(err.message);
    });
  // });
};

// //Alternate way to export
// module.exports = {
//   getHome,
// };

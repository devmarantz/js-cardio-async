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
      res.writeHead(400),
        {
          'Content-Type': 'text/html',
        };
      res.end(err.message);
    });
};

// //Alternate way to export
// module.exports = {
//   getHome,
// };

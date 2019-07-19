const fs = require('fs').promises;
const db = require('./db'); // import our database

// Returns a 404 page and 404 error
exports.notFound = async (req, res) => {
  const html = await fs.readFile('404.html');
  // handle any unfound errors
  res.writeHead(404, {
    'Content-Type': 'text/html',
  });
  res.end(html);
};

//
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

// Returns the status of the owner
exports.getStatus = (req, res) => {
  const status = {
    up: true,
    owner: 'Devon Marantz',
    timestamp: Date.now(),
  };
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Another-Header': 'more things',
  });
  res.end(JSON.stringify(status));
};

// Sets a value to a certain key in a file
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

// Gets a value of a key in a file
exports.get = (req, res, { file, key }) => {
  // check if the file, key, and value are all defined
  if (!file || !key) {
    res.writeHead(400);
    res.end('File and Key queries are required');
  }
  // fire off the db set method
  db.get(file, key)
    .then(value => {
      res.writeHead(200);
      res.end(value);
    })
    .catch(err => {
      res.writeHead(400, {
        'Content-Type': 'text/html',
      });
      res.end(err.message);
    });
};

// Removes a value of a key in a file
exports.deleteRemove = (req, res, { file, key }) => {
  // check if the file, key, and value are all defined
  if (!file || !key) {
    res.writeHead(400);
    res.end('File and Key queries are required');
  }
  // fire off the db set method
  db.remove(file, key)
    .then(value => {
      res.writeHead(202);
      res.end(value);
    })
    .catch(err => {
      res.writeHead(400, {
        'Content-Type': 'text/html',
      });
      res.end(err.message);
    });
};

exports.getUnion = (req, res, { fileA, fileB }) => {
  // check if the file, key, and value are all defined
  if (!fileA || !fileB) {
    res.writeHead(400);
    res.end('fileA and fileB are required');
  }
  return db
    .union(fileA, fileB)
    .then(props => {
      res.writeHead(202);
      res.end(props);
    })
    .catch(err => {
      res.writeHead(400, {
        'Content-Type': 'text/html',
      });
      res.end(err.message);
    });
};

exports.getDifference = (req, res, { fileA, fileB }) => {
  // check if the file, key, and value are all defined
  if (!fileA || !fileB) {
    res.writeHead(400);
    res.end('fileA and fileB are required');
  }
  return db
    .difference(fileA, fileB)
    .then(props => {
      res.writeHead(202);
      res.end(props);
    })
    .catch(err => {
      res.writeHead(400, {
        'Content-Type': 'text/html',
      });
      res.end(err.message);
    });
};

exports.getIntersect = (req, res, { fileA, fileB }) => {
  // check if the file, key, and value are all defined
  if (!fileA || !fileB) {
    res.writeHead(400);
    res.end('fileA and fileB are required');
  }
  return db
    .intersect(fileA, fileB)
    .then(props => {
      res.writeHead(202);
      res.end(props);
    })
    .catch(err => {
      res.writeHead(400, {
        'Content-Type': 'text/html',
      });
      res.end(err.message);
    });
};

// Writes a new file with a filename and body
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

// Gets all files
exports.getMergeData = (req, res) => {
  db.mergeData()
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
};

// Gets a file given a filename
exports.getFile = (req, res, pathname) => {
  db.getFile(pathname.split('/')[2])
    .then(body => {
      res.writeHead(200, {
        'Content-Type': 'application/json',
      });
      res.end(body);
    })
    .catch(err => {
      res.writeHead(404, {
        'Content-Type': 'text/html',
      });
      res.end(err.message);
    });
};

// Deletes a file given a filename
exports.deleteFile = (req, res, pathname) => {
  // event emitted when the request has received all of the data
  // req.on('end', async () => {
  // parse our data array
  const filename = pathname.split('/')[2];
  db.deleteFile(filename)
    .then(() => {
      res.writeHead(204);
      console.log(`${filename} successfully deleted`);
      res.end('succesfully deleted');
    })
    .catch(err => {
      res.writeHead(400, {
        'Content-Type': 'text/html',
      });
      res.end(err.message);
    });
};

// //Alternate way to export
// module.exports = {
//   getHome,
// };

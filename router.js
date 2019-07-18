const url = require('url'); // import URL module
const db = require('./db'); // import our database
const { getHome, getStatus, patchSet, notFound } = require('./controller'); //import our controller

const handleRoutes = (req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  // check if request was a GET to '/' route
  if (req.url === '/' && req.method === 'GET') {
    return getHome(req, res);
  }

  if (req.url === '/status' && req.method === 'GET') {
    return getStatus(req, res);
  }

  // parse the url to an object

  // SET
  if (pathname === '/set' && req.method === 'PATCH') {
    return patchSet(req, res, query);
  }

  // REMOVE
  if (pathname === '/remove' && req.method === 'PATCH') {
    return db
      .remove(query.file, query.key)
      .then(() => {
        res.end('key deleted');
      })
      .catch(err => {
        //TODO:
      });
  }

  // DELETEFILE
  if (pathname === '/deleteFile' && req.method === 'DELETE') {
    return db
      .deleteFile(query.file)
      .then(() => {
        res.end('file deleted');
      })
      .catch(err => {
        // TODO:
      });
  }

  // CREATEFILE
  if (pathname === '/createFile' && req.method === 'POST') {
    return db
      .createFile(query.file)
      .then(() => {
        res.end('file created');
      })
      .catch(err => {
        // TODO:
      });
  }

  // MERGEDATA
  if (pathname === '/mergeData' && req.method === 'GET') {
    return db
      .mergeData()
      .then(() => {
        res.end('file merged');
      })
      .catch(err => {
        // TODO:
      });
  }

  // UNION
  if (pathname === '/union' && req.method === 'GET') {
    return db
      .union(query.fileA, query.fileB)
      .then(() => {
        res.end('union established');
      })
      .catch(err => {
        // TODO:
      });
  }

  // INTERSECT
  if (pathname === '/intersect' && req.method === 'GET') {
    return db
      .intersect(query.fileA, query.fileB)
      .then(() => {
        res.end('intersection established');
      })
      .catch(err => {
        // TODO:
      });
  }

  // DIFFERENCE
  if (pathname === '/difference' && req.method === 'GET') {
    return db
      .difference(query.fileA, query.fileB)
      .then(() => {
        res.end('difference established');
      })
      .catch(err => {
        // TODO:
      });
  }

  // Handle any routes that are not found
  notFound(req, res);
};

module.exports = {
  handleRoutes,
};

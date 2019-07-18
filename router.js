const url = require('url'); // import URL module
const db = require('./db'); // import our database
const {
  getHome,
  getStatus,
  patchSet,
  notFound,
  postWrite,
  getFile,
  get,
  deleteRemove,
  deleteFile,
  getMergeData,
  getUnion,
} = require('./controller'); //import our controller

const handleRoutes = (req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  // check if request was a GET to '/' route
  if (req.url === '/' && req.method === 'GET') {
    return getHome(req, res);
  }

  if (req.url === '/status' && req.method === 'GET') {
    return getStatus(req, res);
  }

  // SET
  // parse the url to an object
  if (pathname === '/set' && req.method === 'PATCH') {
    return patchSet(req, res, query);
  }

  // GET Value with Key
  if (pathname === '/get' && req.method === 'GET') {
    return get(req, res, query);
  }

  // REMOVE a value with key
  if (pathname === '/remove' && req.method === 'DELETE') {
    return deleteRemove(req, res, query);
  }

  // DELETE a file
  if (pathname.startsWith('/delete') && req.method === 'PATCH') {
    return deleteFile(req, res, pathname);
  }

  // MERGEDATA
  if (pathname === '/mergeData' && req.method === 'GET') {
    return getMergeData(req, res);
  }

  // UNION
  if (pathname === '/union' && req.method === 'GET') {
    return getUnion(req, res, query);
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

  if (pathname.startsWith('/write') && req.method === 'POST') {
    return postWrite(req, res, pathname);
  }

  if (pathname.startsWith('/get') && req.method === 'GET') {
    return getFile(req, res, pathname);
  }

  // Handle any routes that are not found
  notFound(req, res);
};

module.exports = {
  handleRoutes,
};

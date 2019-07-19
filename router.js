const url = require('url'); // import URL module
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
  getDifference,
  getIntersect,
} = require('./controller'); //import our controller

const handleRoutes = (req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  // DEFAULT
  // check if request was a GET to '/' route
  if (req.url === '/' && req.method === 'GET') {
    return getHome(req, res);
  }

  // STATUS
  // Returns the owner and current time
  if (req.url === '/status' && req.method === 'GET') {
    return getStatus(req, res);
  }

  // SET
  // parse the url to an object
  // Sets a value to a certain key in a file
  if (pathname === '/set' && req.method === 'PATCH') {
    return patchSet(req, res, query);
  }

  // GET Value with Key
  // Gets a value of a key in a file with query parameters
  if (pathname === '/get' && req.method === 'GET') {
    return get(req, res, query);
  }

  // REMOVE a value with key
  // Removes a value of a key in a file
  if (pathname === '/remove' && req.method === 'DELETE') {
    return deleteRemove(req, res, query);
  }

  // DELETE a file
  // Deletes a file using a pathname
  if (pathname.startsWith('/delete') && req.method === 'PATCH') {
    return deleteFile(req, res, pathname);
  }

  // MERGEDATA
  // Returns all of the files
  if (pathname === '/mergeData' && req.method === 'GET') {
    return getMergeData(req, res);
  }

  // UNION
  // Takes two files and logs all the properties as a list without duplicates
  if (pathname === '/union' && req.method === 'GET') {
    return getUnion(req, res, query);
  }

  // INTERSECT
  // Takes two files and logs all the properties that both objects share
  if (pathname === '/intersect' && req.method === 'GET') {
    return getIntersect(req, res, query);
  }

  // DIFFERENCE
  // Takes two files and logs all properties that are different between the two objects
  if (pathname === '/difference' && req.method === 'GET') {
    return getDifference(req, res, query);
  }

  // CREATE FILE
  // Writes a new file with a pathname and body
  if (pathname.startsWith('/write') && req.method === 'POST') {
    return postWrite(req, res, pathname);
  }

  // GET FILE
  // Gets a file given the name of a file in the pathname
  if (pathname.startsWith('/file') && req.method === 'GET') {
    return getFile(req, res, pathname);
  }

  // 404 Page
  // Handle any routes that are not found
  notFound(req, res);
};

module.exports = {
  handleRoutes,
};

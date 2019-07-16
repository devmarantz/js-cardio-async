const fs = require('fs').promises;
/*
All of your functions must return a promise!
*/

/* 
Every function should be logged with a timestamp.
If the function logs data, then put that data into the log
ex after running get('user.json', 'email'):
  sroberts@talentpath.com 1563221866619

If the function just completes an operation, then mention that
ex after running delete('user.json'):
  user.json succesfully delete 1563221866619

Errors should also be logged (preferably in a human-readable format)
*/

function log(value) {
  return fs.appendFile('log.txt', `\n${value} ${Date.now()}\n`);
}

/**
 * Logs the value of object[key]
 * @param {string} file
 * @param {string} key
 */
async function get(file, key) {
  try {
    // 1. Read File
    // 2. Handle Promise → Data
    const data = await fs.readFile(file, 'utf-8');
    // 3. Parse data from string → JSON
    const parsed = JSON.parse(data);
    // 4. Use the key to get the value at the object[key]
    const value = parsed[key];
    // 5. append the log file with the above value
    if (!value) return log(`ERROR ${key} invalid on ${file}`);
    return log(value);
  } catch (err) {
    return log(`ERROR no such file or directory ${file}`);
  }
}

/**
 * Sets the value of object[key] and rewrites object to file
 * @param {string} file
 * @param {string} key
 * @param {string} value
 */
async function set(file, key, value) {
  try {
    // 1. Read File
    // 2. Handle Promise → Data
    const data = await fs.readFile(file, 'utf-8');
    // 3. Parse data from string → JSON
    const parsed = JSON.parse(data);
    // 4. Check if the key exists
    // 5. append the log file with the above value
    parsed[key] = value;
    // 6. Write file with new value
    await fs.writeFile(file, JSON.stringify(parsed), 'utf-8');
    return console.log(parsed);
  } catch (err) {
    return log(`ERROR no such file or directory ${file}`);
  }
}

/**
 * Deletes key from object and rewrites object to file
 * @param {string} file
 * @param {string} key
 */
async function remove(file, key) {
  try {
    // 1. Read File
    // 2. Handle Promise → Data
    const data = await fs.readFile(file, 'utf-8');
    // 3. Parse data from string → JSON
    const parsed = JSON.parse(data);
    // 4. Delete key
    delete parsed[key];
    // 5. Write file with new value
    await fs.writeFile(file, JSON.stringify(parsed), 'utf-8');
    return console.log(parsed);
  } catch (err) {
    return log(`ERROR no such file or directory ${file}`);
  }
}

/**
 * Deletes file.
 * Gracefully errors if the file does not exist.
 * @param {string} file
 */
function deleteFile(file) {
  try {
    return fs.unlink(file);
  } catch (err) {
    return log(`ERROR no such file or directory ${file}`);
  }
}

/**
 * Creates file with an empty object inside.
 * Gracefully errors if the file already exists.
 * @param {string} file JSON filename
 */
async function createFile(file) {
  const checkData = await fs.readFile(file, 'utf-8').catch(err => {
    fs.writeFile(file, '{}', 'utf-8');
    return log(`${file} created`);
  });
  if (checkData) {
    return log(`ERROR File ${file} already exists`);
  }
}

/**
 * Merges all data into a mega object and logs it.
 * Each object key should be the filename (without the .json) and the value should be the contents
 * ex:
 *  {
 *  user: {
 *      "firstname": "Scott",
 *      "lastname": "Roberts",
 *      "email": "sroberts@talentpath.com",
 *      "username": "scoot"
 *    },
 *  post: {
 *      "title": "Async/Await lesson",
 *      "description": "How to write asynchronous JavaScript",
 *      "date": "July 15, 2019"
 *    }
 * }
 */
function mergeData() {}

/**
 * Takes two files and logs all the properties as a list without duplicates
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *  union('scott.json', 'andrew.json')
 *  // ['firstname', 'lastname', 'email', 'username']
 */
function union(fileA, fileB) {}

/**
 * Takes two files and logs all the properties that both objects share
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *    intersect('scott.json', 'andrew.json')
 *    // ['firstname', 'lastname', 'email']
 */
function intersect(fileA, fileB) {}

/**
 * Takes two files and logs all properties that are different between the two objects
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *    difference('scott.json', 'andrew.json')
 *    // ['username']
 */
function difference(fileA, fileB) {}

function reset() {
  const andrew = fs.writeFile(
    './andrew.json',
    JSON.stringify({
      firstname: 'Andrew',
      lastname: 'Maney',
      email: 'amaney@talentpath.com',
    })
  );
  const scott = fs.writeFile(
    './scott.json',
    JSON.stringify({
      firstname: 'Scott',
      lastname: 'Roberts',
      email: 'sroberts@talentpath.com',
      username: 'scoot',
    })
  );
  const post = fs.writeFile(
    './post.json',
    JSON.stringify({
      title: 'Async/Await lesson',
      description: 'How to write asynchronous JavaScript',
      date: 'July 15, 2019',
    })
  );
  const log = fs.writeFile('./log.txt', '');
  return Promise.all([andrew, scott, post, log]);
}

module.exports = {
  get,
  set,
  remove,
  deleteFile,
  createFile,
  mergeData,
  union,
  intersect,
  difference,
  reset,
};

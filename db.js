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

/**
 * logs action
 * @param {string} file
 * @param {Error} [err]
 */
async function log(value, err) {
  await fs.appendFile('log.txt', `\n${value} ${Date.now()}\n`);
  // Pass along (throw) error if it exists
  if (err) throw err;
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
    const data = await fs.readFile(`./database/${file}`, 'utf-8');
    // 3. Parse data from string → JSON
    const parsed = JSON.parse(data);
    // 4. Use the key to get the value at the object[key]
    const value = parsed[key];
    // 5. append the log file with the above value
    if (!value) return log(`ERROR ${key} invalid on ${file}`);
    log(value);
    return value;
  } catch (err) {
    return log(`ERROR no such file or directory ${file}`, err);
  }
}

/**
 * Logs the value of object[key]
 * @param {string} file
 * @param {string} key
 */
async function getFile(file) {
  try {
    // 1. Read File
    // 2. Handle Promise → Data
    const data = await fs.readFile(`./database/${file}`, 'utf-8');
    // 3. Parse and return data from string → JSON
    log(data);
    return data;
  } catch (err) {
    return log(`ERROR no such file or directory ${file}`, err);
  }
}

/**
 * Sets the value of object[key] and rewrites object to file
 * @param {string} file
 * @param {string} key
 * @param {string} value
 */
// // ----------------------ASYNC-------------------------------
// async function set(file, key, value) {
//   try {
//     // 1. Read File
//     // 2. Handle Promise → Data
//     const data = await fs.readFile(`./database/${file}`, 'utf-8');
//     // 3. Parse data from string → JSON
//     const parsed = JSON.parse(data);
//     // 4. Check if the key exists
//     // 5. append the log file with the above value
//     parsed[key] = value;
//     // 6. Write file with new value
//     await fs.writeFile(`./database/${file}`, JSON.stringify(parsed), 'utf-8');
//     return console.log(parsed);
//   } catch (err) {
//     return log(`ERROR no such file or directory ${file}`);
//   }
// }
// --------------------------Promises--------------------------
function set(file, key, value) {
  return (
    fs
      // reads
      .readFile(`./database/${file}`, 'utf8')
      .then(data => {
        // parse
        const parsed = JSON.parse(data);
        // adds property the converts back to JSON format
        parsed[key] = value;
        const newObj = JSON.stringify(parsed);
        fs.writeFile(`./database/${file}`, newObj);
        return log(value);
      })
      .catch(err => log(`ERROR no such file or directory ${file}`, err))
  );
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
    const data = await fs.readFile(`./database/${file}`, 'utf-8');
    // 3. Parse data from string → JSON
    const parsed = JSON.parse(data);
    // 4. Delete key
    delete parsed[key];
    // 5. Write file with new value
    await fs.writeFile(`./database/${file}`, JSON.stringify(parsed), 'utf-8');

    const newData = await fs.readFile(`./database/${file}`, 'utf-8');
    return newData;
  } catch (err) {
    return log(`ERROR no such file or directory ${file}`, err);
  }
}

/**
 * Deletes file.
 * Gracefully errors if the file does not exist.
 * @param {string} file
 */
function deleteFile(file) {
  try {
    return fs.unlink(`./database/${file}`);
  } catch (err) {
    return log(`ERROR no such file or directory ${file}`);
  }
}

/**
 * Creates file with an empty object inside.
 * Gracefully errors if the file already exists.
 * @param {string} file JSON filename
 */
// // ------------------ASYNC-------------------------------
// async function createFile(file) {
//   const checkData = await fs.readFile(`./database/${file}`, 'utf-8').catch(err => {
//     fs.writeFile(file, '{}', 'utf-8');
//     return log(`${file} created`);
//   });
//   if (checkData) {
//     return log(`ERROR File ${file} already exists`);
//   }
// }
// // -------------------Promises--------------------------
// function createFile(file) {
//   return fs
//     .access(`./database/${file}`)
//     .then(() => log(`Cannot create file, '${file}' already exists`))
//     .catch(() => fs.writeFile(`./database/${file}`, '{}'))
//     .then(() => log(`Successfully created '${file}'`));
// }
// ------------------ASYNC With Access-------------------
async function createFile(file, content) {
  try {
    await fs.access(`./database/${file}`);
    return log(`ERROR file or directory already exists: ${file}`);
  } catch {
    await fs.writeFile(`./database/${file}`, JSON.stringify(content));
    return log(`${file}: created`);
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
// -----------------My Attempt-------------------
// async function mergeData() {
//   let megaData = {};
//   const files = [];
//   const fileData = [];
//   const data = await fs.readdir('./database/');
//   // creates keys for files
//   data.forEach(file => {
//     megaData[file] = {};
//     files.push(file);
//   });
//   files.forEach(function(file) {
//     fs.readFile(`./database/${file}/`, 'utf-8').then(data => {
//       fileData.push(data);
//     });
//   });

//   // console.log(`Mega Data: ${megaData}\n`);
//   console.log(fileData);
//   return console.log(megaData);
// }
// --------------------ASYNC EM-------------------
async function mergeData() {
  try {
    const megaObj = {};
    const files = await fs.readdir(`./database/`);
    for await (const file of files) {
      const trimmedFileName = file.slice(0, file.indexOf('.'));
      megaObj[trimmedFileName] = JSON.parse(await fs.readFile(`./database/${file}`, 'utf8'));
    }
    return log(JSON.stringify(megaObj));
  } catch (err) {
    return log(`ERROR ${err}`);
  }
}

/**
 * Takes two files and logs all the properties as a list without duplicates
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *  union('scott.json', 'andrew.json')
 *  // ['firstname', 'lastname', 'email', 'username']
 */
async function union(fileA, fileB) {
  const props = [];
  const dataA = await fs.readFile(`./database/${fileA}`, 'utf-8');
  const dataB = await fs.readFile(`./database/${fileB}`, 'utf-8');
  const parsedA = JSON.parse(dataA);
  const parsedB = JSON.parse(dataB);
  Object.keys(parsedA).forEach(key => props.push(key));
  Object.keys(parsedB).forEach(key => {
    if (!props.includes(key)) props.push(key);
  });
  return log(`[${props}]`);
}

/**
 * Takes two files and logs all the properties that both objects share
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *    intersect('scott.json', 'andrew.json')
 *    // ['firstname', 'lastname', 'email']
 */
async function intersect(fileA, fileB) {
  const props = [];
  const dataA = await fs.readFile(`./database/${fileA}`, 'utf-8');
  const dataB = await fs.readFile(`./database/${fileB}`, 'utf-8');
  const parsedA = JSON.parse(dataA);
  const parsedB = JSON.parse(dataB);
  Object.keys(parsedA).forEach(key => {
    if (Object.keys(parsedB).includes(key)) props.push(key);
  });
  Object.keys(parsedB).forEach(key => {
    if (!props.includes(key)) props.push(key);
  });
  return log(`[${props}]`);
}

/**
 * Takes two files and logs all properties that are different between the two objects
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *    difference('scott.json', 'andrew.json')
 *    // ['username']
 */
async function difference(fileA, fileB) {
  const props = [];
  const dataA = await fs.readFile(`./database/${fileA}`, 'utf-8');
  const dataB = await fs.readFile(`./database/${fileB}`, 'utf-8');
  const parsedA = JSON.parse(dataA);
  const parsedB = JSON.parse(dataB);
  Object.keys(parsedA).forEach(key => {
    if (!Object.keys(parsedB).includes(key)) props.push(key);
  });
  Object.keys(parsedB).forEach(key => {
    if (!Object.keys(parsedA).includes(key)) props.push(key);
  });
  return log(`[${props}]`);
}

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
  getFile,
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

require('dotenv').config()

const fs = require('fs');
const fsPromises = fs.promises;

const getDirectoryContents = require('./getDirectoryContents');

const SOFTWARE_TESTING_PATH = process.env.SOFTWARE_TESTING_PATH
const SOFTWARE_PRODUCTION_PATH = process.env.SOFTWARE_PRODUCTION_PATH


//get testing packages
getDirectoryContents(SOFTWARE_TESTING_PATH)
    .then(files => JSON.stringify(files, null, 4))
    .then(console.log)
    .catch(console.error);

//get production packages
getFiles(SOFTWARE_PRODUCTION_PATH)
    .then(files => JSON.stringify(files, null, 4))
    .then(console.log)
    .catch(console.error);

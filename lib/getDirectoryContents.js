const fs = require("fs");
const fsPromises = fs.promises;

const path = require("path");
const util = require("util");

// Promisify the fs functions we will use (or use require("fs").promises)
// const astat = util.promisify(fs.stat);
const areaddir = fsPromises.readdir;

/**
 * Get a list of all files in a directory
 * @param {String} dir The directory to inventory
 * @returns {Array} Array of files
 */
async function getFiles(dir) {
    // Get this directory's contents
    const files = await areaddir(dir);

    // Wait on all the files of the directory
    return files.map(f => path.join(dir, f))
}

module.exports = getFiles
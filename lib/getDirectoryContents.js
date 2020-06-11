const fs = require("fs");
const path = require("path");
const util = require("util");

// Promisify the fs functions we will use (or use require("fs").promises)
const astat = util.promisify(fs.stat);
const areaddir = util.promisify(fs.readdir);

/**
 * Get a list of all files in a directory
 * @param {String} dir The directory to inventory
 * @returns {Array} Array of files
 */
async function getFiles(dir) {
    // Get this directory's contents
    const files = await areaddir(dir);
    // Wait on all the files of the directory
    return Promise.all(files
        // Prepend the directory this file belongs to
        .map(f => path.join(dir, f))
        // Iterate the files and see if we need to recurse by type
        .map(async f => {
            // See what type of file this is
            const stats = await astat(f);
            // Recurse if it is a directory, otherwise return the filepath
            return stats.isDirectory() ? getFiles(f) : f;
        }));
}

module.exports = getFiles
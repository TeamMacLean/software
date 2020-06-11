require('dotenv').config()

const path = require('path')
const fs = require('fs');
const fsPromises = fs.promises;
const util = require("util");
const astat = util.promisify(fs.stat);


const getDirectoryContents = require('./getDirectoryContents');

const SOFTWARE_TESTING_PATH = process.env.SOFTWARE_TESTING_PATH
const SOFTWARE_PRODUCTION_PATH = process.env.SOFTWARE_PRODUCTION_PATH

//get testing packages
get(SOFTWARE_TESTING_PATH)
.then(console.log)
.catch(console.err)

//get production packages
get(SOFTWARE_PRODUCTION_PATH)
.then(console.log)
.catch(console.err)

function get() {
    return getDirectoryContents(SOFTWARE_TESTING_PATH)
        .then(files => {
            return Promise.all(
                files.map(file => {
                    return new Promise((resolve, reject) => {
                        getDirectoryContents(file)
                            .then(contents => {
                                //return dirs

                                const obj = {
                                    package: path.basename(file),
                                    versions: []
                                }

                                Promise.all(
                                    contents.map(c => {
                                        return astat(c)
                                    })
                                )
                                    .then(stats => {
                                        obj.versions = contents.reduce((acc, current, currentI) => {
                                            return stats[currentI].isDirectory() ? acc.concat(path.basename(current)) : acc;
                                        }, [])
                                        resolve(obj)
                                    })
                                    .catch(reject)
                            })
                            .catch(reject)
                    })
                })
            )
        })
}


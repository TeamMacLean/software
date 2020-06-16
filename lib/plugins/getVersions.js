const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const getDirectoryContents = require('../getDirectoryContents')

function getVersions(container) {

    return Promise.all(
        container.packages.map((package, index) => {
            package.versions = container.packages[index].versions || []
            return getDirectoryContents(package.path)
                .then(subItems => {
                    return Promise.all(
                        subItems.map(subItem => {
                            return fsPromises.lstat(subItem)
                                .then(stats => {
                                    if (stats.isDirectory()) {
                                        return getDirectoryContents(subItem)
                                            .then(dirsInSubDir => {
                                                let containsX86_64 = false;
                                                dirsInSubDir.map(ssdir => {
                                                    if (path.basename(ssdir) === 'x86_64') {
                                                        containsX86_64 = true;
                                                    }
                                                })
                                                container.packages[index].versions.push({ name: path.basename(subItem), containsX86_64, valid: containsX86_64 })
                                                return Promise.resolve()
                                            })
                                    } else {
                                        return Promise.resolve();
                                    }
                                })



                        })
                    )
                })
        })
    )
        .then(() => {
            return Promise.resolve(container)
        })
    //get versions


}

module.exports = getVersions
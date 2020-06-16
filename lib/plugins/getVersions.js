const path = require('path');

const getDirectoryContents = require('../getDirectoryContents')

function getVersions(container) {

    return Promise.all(
        container.packages.map((package, index) => {
            package.versions = container.packages[index].versions || []
            return getDirectoryContents(package.path)
                .then(subDirs => {
                    return Promise.all(
                        subDirs.map(subDir => {
                            return getDirectoryContents(subDir)
                                .then(dirsInSubDir => {
                                    let containsX86_64 = false;
                                    dirsInSubDir.map(ssdir => {
                                        if (path.basename(ssdir) === 'x86_64') {
                                            containsX86_64 = true;
                                        }
                                    })
                                    container.packages[index].versions.push({ name: path.basename(subDir), valid: containsX86_64 })
                                    return Promise.resolve()
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
const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
//cecks for uncommented hpccore-5 in the source dir
function installedWithBrew(container) {

    if (!container.packages[0].versions) {
        return Promise.reject(new Error('DOES NOT HAVE VERSIONS')) //TODO: Fix using make style depends-on
    }
    return Promise.all(
        container.packages.map((package, pindex) => {
            return Promise.all(
                package.versions.map((version, vindex) => {
                    container.packages[pindex].versions[vindex].installedWithBrew = container.packages[pindex].versions[vindex].installedWithBrew || false;
                    return new Promise((good, bad) => {
                        const fullPath = path.join(package.path, version.name)
                        fsPromises.lstat(fullPath)
                            .then(stats => {
                                console.log(fullPath, stats)
                                if (stats.isSymbolicLink()) {
                                    console.log(stats.isSymbolicLink())
                                    if (fullPath.split(path.sep).indexOf('brew') > -1) {
                                        //ITS LINKED TO BREW, BURN THE WITCH!
                                        container.packages[pindex].versions[vindex].installedWithBrew = true;
                                    }
                                    good();
                                } else {
                                    good();
                                }
                            })
                            .catch(bad)
                    });
                })

            )
        })
    )
        .then(() => {
            return Promise.resolve(container)
        })



}

module.exports = installedWithBrew;
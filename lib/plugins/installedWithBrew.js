const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
//cecks for uncommented hpccore-5 in the source dir
function installedWithBrew(container) {

    if (!container.packages[0].versions) {
        return Promise.reject(new Error('DOES NOT HAVE VERSIONS')) //TODO: Fix using make style depends-on
    }
    Promise.all(
        container.packages.map((package, pindex) => {
            Promise.all(
                package.versions.map((version, vindex) => {
                    container.packages[pindex].versions[vindex].installedWithBrew = container.packages[pindex].versions[vindex].installedWithBrew || false;
                    return new Promise((good, bad) => {
                        const fullPath = path.join(package.path, version.name)
                        fsPromises.lstat(path.join(fullPath))
                            .then(stats => {
                                if (stats.isSymbolicLink()) {
                                    console.log(fullPath.split(path.sep))
                                    if (fullPath.split(path.sep).indexOf('brew') > -1) {
                                        //ITS LINKED TO BREW, BURN THE WITCH!
                                        container.packages[pindex].versions[vindex].installedWithBrew = true;
                                    }
                                }
                                good();
                            })
                            .catch(bad)
                    });
                })

            )
        })
    )


    return Promise.resolve(container)
}

module.exports = installedWithBrew;
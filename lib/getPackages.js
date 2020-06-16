require('dotenv').config()

const path = require('path')
const fs = require('fs');
// const fsPromises = fs.promises;

const getDirectoryContents = require('./getDirectoryContents');

const SOFTWARE_TESTING_PATH = process.env.SOFTWARE_TESTING_PATH
const SOFTWARE_PRODUCTION_PATH = process.env.SOFTWARE_PRODUCTION_PATH

// const loadedPlugins = [];

//get plugins
// getDirectoryContents(path.join(__dirname, 'plugins'))
//     .then(plugins => {
//         plugins.map(p => {
//             loadedPlugins.push(require(p))
//         })
//         console.log('loaded', loadedPlugins)
//     })
//     .catch(err => { throw (err) })

const loadedPlugins = [
    require('./plugins/getVersions'),
    require('./plugins/hpccore'),
    require('./plugins/installedWithBrew')
]


// //get testing packages
//get production packages
get(SOFTWARE_PRODUCTION_PATH)
    .then(production => {
        // console.log('production', production)
        return loadedPlugins.reduce((prev, cur) => prev.then(cur), Promise.resolve(production))

    })
    .then(function (packagesPostPlugins) {
        console.log("done running plugins", JSON.stringify(packagesPostPlugins))
    })
    .catch(err => { throw (err) })

async function get() {
    const contents = await getDirectoryContents(SOFTWARE_TESTING_PATH)

    let container = {};

    container.packages = contents.reduce((collector, item) => {
        if (path.basename(item) === 'bin') {
            return collector
        }
        return collector.concat({
            package: path.basename(item),
            path: item
        })
    }, [])


    return Promise.resolve(container)
}
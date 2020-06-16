require('dotenv').config()

const path = require('path')
const fs = require('fs');
const fsPromises = fs.promises;
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


Promise.all([
    get(SOFTWARE_TESTING_PATH, 'Testing'),
    get(SOFTWARE_PRODUCTION_PATH, 'Production')
])
    .then(containers => {
        return Promise.all(
            containers.map(c => {
                return runPlugins(c)
            })
        )
    })
    .then(containersPostPlugins => {
        return writeHistory(containersPostPlugins)
    })
    .then(() => {
        console.log('done')
    })
    .catch(err => {
        console.error(err);
    })


function runPlugins(container) {
    return loadedPlugins.reduce((prev, cur) => prev.then(cur), Promise.resolve(container))
}

async function get(PATH_TO_SCAN, name) {
    const contents = await getDirectoryContents(PATH_TO_SCAN)

    let container = { name };

    container.packages = contents.reduce((collector, item) => {
        if (path.basename(item) === 'bin') {
            return collector
        }
        return collector.concat({
            name: path.basename(item),
            path: item
        })
    }, [])


    return Promise.resolve(container)
}

function writeHistory(containersPostPlugins) {
    const pp = JSON.stringify(containersPostPlugins, null, 4);
    fsPromises.writeFile(path.join(__dirname, '../', 'history', 'output.json'), pp)
}
var fs = require('fs');
var path = require('path');

function getTplData(folder) {
    var dataPath = path.resolve(folder,'data.json');
    var data = fs.readFileSync(dataPath, 'utf8');

    return JSON.parse(data);
}

module.exports = getTplData;

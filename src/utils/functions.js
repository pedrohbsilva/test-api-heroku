const fileSystem = require('fs');

function getData(fileName){
    const result = JSON.parse(fileSystem.readFileSync('src/database/'+fileName, 'utf8'));
    return result
}

function createOrUpdateData(fileName, data){
    fileSystem.writeFileSync('src/database/'+ fileName, JSON.stringify(data));
}

function responder(res, codeStatus, object) {
    return res.status(codeStatus).send(object)
}

module.exports = {
    getData,
    createOrUpdateData,
    responder
}
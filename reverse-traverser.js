var fs = require('fs');
var path = require('path');


function reverseTraverse(filePath) {
    var csvContent = fs.readFileSync(filePath, 'utf8');
    var csvContentArray = csvContent.split('\n');
    var fileValueMap = {};

    csvContentArray = csvContentArray.splice(1);
    csvContentArray.forEach(function (individualLine) {
        if (individualLine !== "") {
            var tabSeperatedValues = individualLine.split('\t');
            var folderName = tabSeperatedValues[0];
            var translationKey = tabSeperatedValues[1];
            var englishContent = tabSeperatedValues[2];
            var germanContent = tabSeperatedValues[3];
            var frenchContent = tabSeperatedValues[4];
            frenchContent = frenchContent.replace('\r', '');
            if (!fileValueMap[folderName]) {
                fileValueMap[folderName] = {
                    en: [],
                    de: [],
                    fr: []
                };
            }
            fileValueMap[folderName]['en'].push(createObject(translationKey, englishContent));
            fileValueMap[folderName]['de'].push(createObject(translationKey, germanContent));
            fileValueMap[folderName]['fr'].push(createObject(translationKey, frenchContent));
        }
    });

    for (var key in fileValueMap) {
        var finalObjDe = {};
        var finalObjEn = {};
        var finalObjFr = {};

        fileValueMap[key]['de'].forEach(function (keyMap) {
            for (var key_3 in keyMap) {
                var keyArray = key_3.split('.');
                var a = recursiveRestoreKeyValue(keyArray, 0, keyMap[key_3], finalObjDe);
            }
        });
        console.log('restored translation file ' + key + '/lang-de-DE.JSON');
        fileValueMap[key]['en'].forEach(function (keyMap) {
            for (var key_3 in keyMap) {
                var keyArray = key_3.split('.');
                var a = recursiveRestoreKeyValue(keyArray, 0, keyMap[key_3], finalObjEn);
            }
        });
        console.log('restored translation file ' + key + '/lang-en-EN.JSON');
        fileValueMap[key]['fr'].forEach(function (keyMap) {
            for (var key_3 in keyMap) {
                var keyArray = key_3.split('.');
                var a = recursiveRestoreKeyValue(keyArray, 0, keyMap[key_3], finalObjFr);
            }
        });
        console.log('restored translation file ' + key + '/lang-fr-FR.JSON');

        // console.log('the file : ' + key);
        // console.log('will have the content DE: ');
        // console.log(finalObjDe);
        // console.log('will have the content EN: ');
        // console.log(finalObjEn);
        // console.log('will have the content FR: ');
        // console.log(finalObjFr);

        fs.writeFileSync(path.resolve(key, 'lang-de-DE.json'), JSON.stringify(finalObjDe), 'utf8');
        fs.writeFileSync(path.resolve(key, 'lang-en-US.json'), JSON.stringify(finalObjEn), 'utf8');
        fs.writeFileSync(path.resolve(key, 'lang-fr-FR.json'), JSON.stringify(finalObjFr), 'utf8');
    }
}

function recursiveRestoreKeyValue(keyArray, traversedTill, value, obj) {
    var preppedString = 'obj';
    for (var i = 0; i <= traversedTill; i++) {
        var preppedString = preppedString + '[\'' + keyArray[i] + '\']';
        var temp;
        eval('temp = ' + preppedString);
        if (!temp) {
            eval(preppedString + '= {}');
        }
    }
    if (traversedTill == keyArray.length - 1) {
        eval(preppedString + '= value');
        return obj;
    } else {
        recursiveRestoreKeyValue(keyArray, traversedTill + 1, value, obj);
    }
}

function createObject(key, value) {
    var newObject = {};
    newObject[key] = value;
    return newObject;
}

module.exports.reverseTraverse = reverseTraverse;
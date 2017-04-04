var fs = require('fs');
var path = require('path');

// console.log(__dirname);
var translationFileMap = {};
var totalTranslationFileNumber = 0;

function travarseFolder(fileOrFolderName, depth) {
    var s = '';
    for (var i = 0; i < depth; i++) {
        s = s + '-';
    }
    var filesArray = fileOrFolderName.split('\\');
    var fileName = filesArray[filesArray.length - 1];
    var fileExt = fileName.split('.')[1];

    s = s + fileName;

    if (fs.lstatSync(fileOrFolderName).isDirectory()) {

        var fileList = fs.readdirSync(fileOrFolderName);
        fileList.forEach(function (file) {
            var file = path.resolve(fileOrFolderName, file);
            return travarseFolder(file, depth + 1);
        });
    } else {
        var languagePatternMatch = fileName.match(/lang-[A-z]*-[A-z]*/);
        if (languagePatternMatch !== null) {
            var language = languagePatternMatch[0].split('-')[1];
            var currentWorkingDirectory = process.cwd();

            totalTranslationFileNumber++;
            var folderName = fileOrFolderName.split('\\');
            folderName.pop();
            folderName = folderName.join('\\');
            folderName = '\\' + folderName.slice(currentWorkingDirectory.length, folderName.length);
            
            if (!translationFileMap[folderName]) {
                translationFileMap[folderName] = {};
            }
            translationFileMap[folderName][language] = fileName;
            console.log('extracting translations from ' + folderName + fileName);
            return translationFileMap;
        }
    } 
    // else if (fileName.match(/lang-[A-z]*-[A-z]*/) !== null) {
    //     totalTranslationFileNumber++;
    //     var folderName = fileOrFolderName.split('\\');
    //     folderName.pop();
    //     folderName = folderName.join('\\');
    //     if (!translationFileMap[folderName]) {
    //         translationFileMap[folderName] = {};
    //     }
    //     translationFileMap[folderName]['de'] = fileName;
    //     console.log('extracting translations from ' + folderName + fileName);
    //     return translationFileMap;
    // } else if (fileName.match(/lang-en/) !== null) {
    //     totalTranslationFileNumber++;
    //     var folderName = fileOrFolderName.split('\\');
    //     folderName.pop();
    //     folderName = folderName.join('\\');
    //     if (!translationFileMap[folderName]) {
    //         translationFileMap[folderName] = {};
    //     }
    //     translationFileMap[folderName]['en'] = fileName;
    //     console.log('extracting translations from ' + folderName + fileName);
    //     return translationFileMap;
    // } else if (fileName.match(/lang-fr/) !== null) {
    //     totalTranslationFileNumber++;
    //     var folderName = fileOrFolderName.split('\\');
    //     folderName.pop();
    //     folderName = folderName.join('\\');
    //     if (!translationFileMap[folderName]) {
    //         translationFileMap[folderName] = {};
    //     }
    //     translationFileMap[folderName]['fr'] = fileName;
    //     console.log('extracting translations from ' + folderName + fileName);
    //     return translationFileMap;
    // }
}

function extractTranslations(folderName, exportFileName) {

    travarseFolder(folderName, 0);

    var writeDestination = path.resolve(folderName, exportFileName);



    fs.appendFileSync(writeDestination, "FILE PATH\t TRANSLATION KEY\t ENGLISH\t GERMAN\t FRENCH\n", 'utf8');
    console.log(translationFileMap);
    for (var key in translationFileMap) {

        var contentForCSV = {
        };

        for (var lang in translationFileMap[key]) {
            var JSONDump = fs.readFileSync(process.cwd() + key + '\\' + translationFileMap[key][lang], 'utf8');
            if (JSONDump.charAt(0) !== '{')
                JSONDump = JSONDump.slice(1);

            var KeyValueMap = {};
            var Obj = JSON.parse(JSONDump);
            mixUpJson('', Obj, KeyValueMap);
            contentForCSV[lang] = KeyValueMap;
        }

        for (var key_2 in contentForCSV['en']) {
            var preppedString = '"' + key + '"\t"' + key_2 + '"\t"' + contentForCSV['en'][key_2] + '"\t"' + contentForCSV['de'][key_2] + '"\t"' + contentForCSV['fr'][key_2] + '"\n';
            fs.appendFileSync(writeDestination, preppedString, 'utf8');
        }

    }
    return totalTranslationFileNumber;
}

function mixUpJson(keySequence, obj, keyMapReference) {
    if (typeof obj === 'string') {
        keyMapReference[keySequence] = obj;
    } else {
        for (var key in obj) {
            if (typeof obj[key] === 'object') {
                for (var key in obj) {
                    var newKewSeq = keySequence == '' ? key : keySequence + '.' + key;
                    mixUpJson(newKewSeq, obj[key], keyMapReference);
                }
            } else {
                var newKewSeq = keySequence == '' ? key : keySequence + '.' + key;
                keyMapReference[newKewSeq] = obj[key];
            }
        }
    }
}


module.exports.travarseFolder = extractTranslations;
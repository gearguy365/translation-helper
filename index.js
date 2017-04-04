#!/usr/bin/env node

var inquirer = require('inquirer');
var figlet = require('figlet');
var traverser = require('./traverser.js');
var reverseTraverser = require('./reverse-traverser.js');
var fs = require('fs');
var path = require('path');

//traverser.travarseFolder(process.cwd(), 'damn-shit.tsv');
figlet('Translator', function (err, data) {
    handleSecondStep();
});

function handleSecondStep () {
    inquirer.prompt(
        [
            {
                type: 'rawlist',
                name: 'choice',
                message: 'What do you want to do?',
                choices: ['export translations to .TSV file', 'restore translations from .TSV file']
            }
        ]
    ).then(function (answer) {
        if (answer.choice == 'export translations to .TSV file') {

            inquirer.prompt(
                [
                    {
                        type: 'input',
                        name: 'choice',
                        message: 'Export destination file name (e.g. filename.tsv)'
                    }
                ]
            ).then(function (answer) {
                inquirer.prompt(
                    [
                        {
                            type: 'input',
                            name: 'choice',
                            message: 'Translation file pattern (A regular expression such as, /lang-/)'
                        }
                    ]
                ).then(function (regexAnswer) {
                    var currentWorkingDir = process.cwd();
                    var fileName = answer.choice;
                    var translationFilePattern = regexAnswer.choice;

                    var translationFileCount = traverser.travarseFolder(currentWorkingDir, fileName);

                    console.log(translationFileCount + ' translation files found in the folder "' + process.cwd() + '".\nExport completed on ' + fileName);
                });
            });

        } else if (answer.choice == 'restore translations from .TSV file') {
            var currentWorkingDirFileList = fs.readdirSync(process.cwd());
            var tsvFileList = [];
            currentWorkingDirFileList.forEach(function (fileOrFolderName) {
                if (fileOrFolderName.match(/.tsv/) !== null) {
                    tsvFileList.push(fileOrFolderName);
                }
            });

            if (tsvFileList.length == 0) {
                console.log('No .tsv file found in this directory. Make sure you have the .tsv file on the current working directory.');
                handleSecondStep();
            } else {
                inquirer.prompt(
                    [
                        {
                            type: 'rawlist',
                            name: 'choice',
                            message: 'which one of these .tsv file do you want to restore?',
                            choices: tsvFileList
                        }
                    ]
                ).then(function (answer) {
                    var tsvFileLocation = path.resolve(process.cwd(), answer.choice);
                    // console.log(tsvFileLocation);
                    reverseTraverser.reverseTraverse(tsvFileLocation);
                });
            }
        }
    });
}
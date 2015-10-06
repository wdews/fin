var fs = require('fs'),
    chalk = require('chalk'),
    inquirer = require('inquirer');

var fin = (function() {
    var _self;

    return {
        init: function() {
            _self = this;

            _self.promptUser();
        },
        promptUser: function(err) {
            if(err != undefined && typeof err == 'string') {
                console.log('\n%s\n', chalk.red(err));
            }

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'inputPreference',
                    message: 'How would you like to proceed?',
                    choices: [
                        {
                            name: 'Choose from a list of files in this directory',
                            value: 'choose',
                            checked: false
                        },
                        {
                            name: 'Manually enter a file path',
                            value: 'input',
                            checked: false
                        }
                    ]
                }
            ], function(answers) {
                if(answers.inputPreference == 'choose') {
                    _self.listSpecificFiles();
                } else {
                    _self.receiveFilePath();
                }
            });
        },
        receiveFilePath: function() {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'filePath',
                    message: 'Enter the file path you would like Fin to work with:'
                }
            ], function(answers) {
                if(answers.filePath !== '') {
                    _self.startFin([answers.filePath]);
                } else {
                    _self.promptUser('No file path provided. Returning to main prompt.');
                }
            });
        },
        listSpecificFiles: function() {
            var eligibleFiles = [],
                allDirectoryFiles = fs.readdirSync(__dirname),
                fTypePattern = new RegExp(/^.*\.(scss|SCSS)$/g),
                selectedFiles = [];

            for(var file in allDirectoryFiles) {
                var fname = allDirectoryFiles[file];

                if(! fname.match(fTypePattern)) {
                    continue;
                }
                
                eligibleFiles.push({
                    name: fname,
                    value: [__dirname,fname].join('/'),
                    checked: false
                });
            }

            if(eligibleFiles.length) {
                inquirer.prompt([
                    {
                        type: 'checkbox',
                        name: 'files',
                        message: 'Select the file(s) you would like run through Fin:',
                        choices: eligibleFiles
                    }
                ], function(answers) {
                    if(answers.files.length) {
                        for(var file in answers.files) {
                            selectedFiles.push(answers.files[file]);
                        }
                        _self.startFin(selectedFiles);
                    } else {
                        _self.promptUser('No file(s) selected. Returning to main prompt.');
                    }
                });
            } else {
                _self.promptUser('There are no SCSS files in the current directory.');
            }
        },
        startFin: function(filePaths) {
            if(typeof filePaths != 'object') {
                return;
            }

            for(var path in filePaths) {
                fs.open(filePaths[path], 'r+', function(err, fd) {
                    if(err) {
                        throw err;
                    } else {
                        var fileName = filePaths[path];
                        fs.stat(fileName, function(err, stats) {
                            if(stats.size) {
                                var buffer = new Buffer(stats.size);
                                console.log(buffer.length);
                                fs.read(fd, buffer, 0, buffer.length, null, function(err, bytesRead, buffer) {
                                    if(err) {
                                        throw err;
                                    }
                                    var data = buffer.toString('utf8', 0, buffer.length);
                                    console.log(data);
                                    
                                    fs.close(fd);
                                });
                            }
                        });
                    }
                });
            }
        }
    };
})();

fin.init();

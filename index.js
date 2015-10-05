var fs = require('fs'),
    inquirer = require('inquirer');

var fin = (function() {
    var _self;

    return {
        init: function() {
            _self = this;

            _self.promptUser();
        },
        promptUser: function() {
            var eligibleSassFiles = _self.specificFiles(),
                prompts = [
                {
                    type: 'checkbox',
                    name: 'files',
                    message: 'Select the file(s) you would like run through Fin:',
                    choices: eligibleSassFiles
                }
            ];

            inquirer.prompt(prompts, function(answers) {
                console.log(answers);
            });
        },
        specificFiles: function() {
            var eligibleFiles = [];

            var allDirectoryFiles = fs.readdirSync(__dirname),
                fTypePattern = new RegExp(/^.*\.(scss|SCSS)$/g);

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
                return eligibleFiles
            } else {
                return false;
            }
        }
    };
})();

fin.init();

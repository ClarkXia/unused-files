const glob = require('glob');
const chalk = require('chalk');
const fs = require('fs');

function UnusedPlugin(options) {
    this.sourceDirectories = options.directories || [];
    this.exclude = options.exclude || [];
    this.outputPath = options.outputPath || false;
    this.outputName = options.outputName || 'unusedFile.json'
}

UnusedPlugin.prototype.apply = function(compiler) {
    compiler.plugin('after-emit', function(compilation, done){
        const usedModules = Array.from(compilation.fileDependencies)
            .filter(file => this.sourceDirectories.some(dir => file.indexOf(dir) !== -1))
            .reduce((obj, item) => {
                obj[item] = true;
                return obj;
            }, {});
        Promise.all(
            this.sourceDirectories.map(dir =>
                new Promise((resolve => {
                    glob(dir + '/**', {
                        nodir: true
                    }, (err, files) => {
                        resolve(files);
                    });
                }))
            )
        )
        .then(files => files.map(arr => arr.filter(file => !usedModules[file] && !this.exclude.some(path => file.indexOf(path) !== -1))))
        .then(output.bind(this))
        .then(done);
    }.bind(this));
};

function output(files) {
    const allFiles = files.reduce((array, item) => array.concat(item),[]);
    if (!allFiles.length) return;
    process.stdout.write('\n');
    process.stdout.write(chalk.green('\n*** Unused Plugin ***\n'));
    process.stdout.write(
        chalk.red(`${allFiles.length} unused source files found.\n`)
    );
    allFiles.forEach(file => {
        process.stdout.write(
            chalk.blue(`\n${file}\n`)
        );
    });

    process.stdout.write(chalk.green('\n*** Unused Plugin ***\n\n'));
    if (this.outputPath) {
        fs.writeFileSync(this.outputPath + '/' + this.outputName, JSON.stringify(allFiles, null, 2));
    }
    return;
}

module.exports = UnusedPlugin;
#### install	

```js
npm i --dev unused-files
```

#### Usage

```js
const UnusedPlugin = require('unused-files');
const srcPath = path.join(__dirname, '/src');

module.exports.plugins = module.exports.plugins.concat([
    ...others,
    new UnusedPlugin({
      directories: [srcPath],
      exclude: [srcPath + '/images/', srcPath + '/i18n/'],
      outputFile: true,
      outputName: 'unused-files.json'
    })
]);
```

#### Options

`directories` : array of directories where to look for unused files

`exclude` : array of exclude patterns when looking for unused files

`outputFile` : decide if need to output a file, default to `false`

`outputName`: set the file name output by plugin, default to `unusedFile.json`
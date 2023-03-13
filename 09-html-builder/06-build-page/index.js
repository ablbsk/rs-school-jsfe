const fs = require('fs');
const fsProm = require('fs/promises');
const path = require('path');

const assetsPath = path.join(__dirname, 'assets');
const stylesPath = path.join(__dirname, 'styles');
const componentsPath = path.join(__dirname, 'components');
const projectDistPath = path.join(__dirname, 'project-dist');
const projectDistAssetsPath = path.join(projectDistPath, 'assets');

fs.mkdir(projectDistPath, { recursive: true }, err => {
  if (err) {
    return console.error(err);
  }
});

async function createHTML() {
  const templateStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  const output = fs.createWriteStream(path.join(projectDistPath, 'index.html'));

  const files = await fsProm.readdir(componentsPath, { withFileTypes: true });
  let htmlCode = await fsProm.readFile(path.join(__dirname, 'template.html'))
    .then(function(htmlCode) {
      files.forEach((file, i, arr) => {
        const name = file.name.slice(0, file.name.lastIndexOf('.'));
        fsProm.readFile(path.join(componentsPath, file.name))
          .then(function(data) {
            htmlCode = htmlCode.toString().replace(`{{${name}}}`, data.toString());
            if (i === arr.length - 1) {
              FF(htmlCode);
            }
          });
      });
    });

  const FF = result => {
    templateStream.on('data', chunk => htmlCode = chunk);
    templateStream.on('end', () => output.write(result));
  };
}

fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
  const output = fs.createWriteStream(path.resolve(projectDistPath, 'style.css'));
  files.forEach(file => {
    if (file.isFile()) {
      const stream = fs.createReadStream(path.resolve(stylesPath, file.name));
      stream.pipe(output, { end: false });
    }
  });
});

async function createAssets() {
  await fsProm.readdir(assetsPath, { withFileTypes: true })
    .then(function (folders) {
      folders.forEach(folder => {
        const projectDistFolderPath = path.join(projectDistAssetsPath, folder.name);

        fsProm.mkdir(projectDistFolderPath, { recursive: true })
          .then(function () {
            const assetsFolderPath = path.join(assetsPath, folder.name);
            fsProm.readdir(path.join(assetsPath, folder.name), {withFileTypes: true})
              .then(function(files) {
                files.forEach((file) => {
                  if (file.isFile()) {
                    fs.copyFile(path.join(assetsFolderPath, file.name), path.join(projectDistFolderPath, file.name), err => {
                      if (err) {
                        return console.error(err);
                      }
                    });
                  }
                });
              });
          });
      });
    });
}

/*async function addFiles(folder, projectDistFolderPath) {
  const assetsFolderPath = path.join(assetsPath, folder.name);
  const files = await fsProm.readdir(path.join(assetsPath, folder.name), {withFileTypes: true});

  files.forEach((file) => {
    if (file.isFile()) {
      fs.copyFile(path.join(assetsFolderPath, file.name), path.join(projectDistFolderPath, file.name), err => {
        if (err) {
          return console.error(err);
        }
      });
    }
  });
}*/

createHTML();
createAssets();

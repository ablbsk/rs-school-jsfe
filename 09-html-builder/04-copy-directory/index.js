const fs = require('fs');
const path = require('path');

const filesPath = path.join(__dirname, 'files');
const filesCopyPath = path.join(__dirname, 'files-copy');

fs.mkdir(filesCopyPath, { recursive: true }, err => {
  if (err) {
    return console.error(err);
  }
  console.log('Directory created successfully!');
});

fs.readdir(filesPath, { withFileTypes: true }, (err, files) => {
  files.forEach(file => {
    if (file.isFile()) {
      fs.copyFile(path.join(filesPath, file.name), path.join(filesCopyPath, file.name), err => {
        if (err) {
          return console.error(err);
        }
      });
    }
  });
});

fs.readdir(filesPath, { withFileTypes: true }, (err, files) => {
  fs.readdir(filesCopyPath, { withFileTypes: true }, (err, filesCopy) => {
    const filesNames = files.map(item => item.name);
    filesCopy.forEach(item => {
      if (!filesNames.includes(item.name)) {
        fs.unlink(path.join(filesCopyPath, item.name), err => {
          if (err) {
            console.error(err);
          }
        });
      }
    });
  });
});

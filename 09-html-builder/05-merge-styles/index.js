const fs = require('fs');
const path = require('path');

const stylesPath = path.resolve(__dirname, 'styles');
const projectDistPath = path.resolve(__dirname, 'project-dist');

fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
  const output = fs.createWriteStream(path.resolve(projectDistPath, 'bundle.css'));
  files.forEach(file => {
    if (file.isFile()) {
      const format = path.extname(file.name).slice(1);
      if (format === 'css') {
        const stream = fs.createReadStream(path.resolve(stylesPath, file.name));
        stream.pipe(output, { end: false });
      }
    }
  });
});

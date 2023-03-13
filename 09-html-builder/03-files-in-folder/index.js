const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true },(err, files) => {
  if (err)
    console.log(err);
  else {
    console.log('Current directory filenames: ');
    files.forEach(file => {
      fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
        if (stats.isFile()) {
          const format = path.extname(file.name).slice(1);
          const name = file.name.slice(0, file.name.lastIndexOf('.'));
          const size = (stats.size * 0.000977).toFixed(2);
          console.log(`${name} - ${format} - ${size}kb`);
        }
      });
    });
  }
});

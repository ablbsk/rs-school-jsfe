const path = require('path');
const fs = require('fs');

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

let fileText = '';

stream.on('data', chunk => fileText += chunk);
stream.on('end', () => console.log(fileText));
stream.on('error', error => console.log('Error', error.message));

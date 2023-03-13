const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });

const fileOutput = fs.createWriteStream(path.join(__dirname, 'text.txt'));

const addLine = value =>
  value === 'exit' ? sayGoodbye('Thanks') : fileOutput.write(value + '\n');

const sayGoodbye = word => (output.write(`${word}! Have a nice day =)`), rl.close());

rl.question('Do you want to write text (y / n)? ', value => {
  value === 'y' ? rl.on('line', addLine) : sayGoodbye('Goodbye');
});

rl.on('SIGINT', () => sayGoodbye('Thanks'));

/*
  Test script to check that printing a test page works
*/

const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const message = "Hello World";
const tempFilePath = path.join(os.tmpdir(), `print-${Date.now()}.txt`);
fs.writeFileSync(tempFilePath, message);
const platform = os.platform();

let command;
if (platform === 'win32') {
  command = `notepad /p "${tempFilePath}"`;
} else if (platform === 'darwin' || platform === 'linux') {
  command = `lp "${tempFilePath}"`;
} else {
  console.error(`Unsupported platform: ${platform}`);
  process.exit(1);
}

exec(command, (error, stdout, stderr) => {
  if (error) return console.error(`Error printing: ${error.message}`);
  if (stderr) console.error(`stderr: ${stderr}`);
  console.log('Message sent to printer.');
  fs.unlink(tempFilePath, err => {
    if (err) console.warn(`Could not delete temp file: ${tempFilePath}`);
  });
});

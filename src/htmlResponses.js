const fs = require('fs'); // pull in the file system module

// load files into memory
const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
const editIssue = fs.readFileSync(`${__dirname}/../hosted/editIssue.html`);
const css = fs.readFileSync(`${__dirname}/../hosted/style.css`);

// function to get the index page
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// function to get css page
const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

// function to get the index page
const getEditIssuePage = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(editIssue);
  response.end();
};

// set out public exports
module.exports = {
  getIndex,
  getCSS,
  getEditIssuePage,
};

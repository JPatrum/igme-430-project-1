const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const poster = fs.readFileSync(`${__dirname}/../client/client-poster.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getPoster = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(poster);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

module.exports = {
  getIndex,
  getPoster,
  getCSS,
};

const http = require('http');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const imageHandler = require('./imageResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;
const urlStruct = {
  '/': htmlHandler.getIndex,
  '/poster': htmlHandler.getPoster,
  '/style.css': htmlHandler.getCSS,
  '/image': imageHandler.getImage,
  '/test': jsonHandler.testRes,
  '/key': jsonHandler.byKey,
  '/range': jsonHandler.byRange,
  '/level': jsonHandler.byLevel,
  '/type': jsonHandler.byType,
  '/attribute': jsonHandler.byAttribute,
  notFound: jsonHandler.notFound,
};

const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';

  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  // TODO: Parse body
  request.query = Object.fromEntries(parsedUrl.searchParams);

  if (urlStruct[parsedUrl.pathname]) {
    return urlStruct[parsedUrl.pathname](request, response);
  }

  return urlStruct.notFound(request, response);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});

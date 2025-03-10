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

const send = (request, response, parsedURL) => {
  if (urlStruct[parsedURL.pathname]) {
    return urlStruct[parsedURL.pathname](request, response);
  }
  return urlStruct.notFound(request, response);
}

const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  if (request.method !== 'POST') {
    request.query = Object.fromEntries(parsedUrl.searchParams);
    send(request, response, parsedUrl);
  }
  else {
    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      request.body = query.parse(bodyString);
      send(request, response, parsedUrl);
    });
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});

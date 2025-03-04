const database = require('./database.js');

const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);
  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  };
  response.writeHead(status, headers);
  if (request.method !== 'HEAD') {
    response.write(content);
  }
  response.end();
};

const byKey = (request, response) => {
  // TODO
}

const byRange = (request, response) => {
  // TODO
}

const byLevel = (request, response) => {
  // TODO
}

const byType = (request, response) => {
  // TODO
}

const byAttribute = (request, response) => {
  // TODO
}

const testRes = (request, response) => {
  const testObj = {
    results: [],
  };

  for (let i = 0; i < 500; i++) {
    testObj.results.push(database.db[i]);
  }

  respondJSON(request, response, 200, testObj);
};

const notFound = (request, response) => {
  // create error message for response
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  // return a 404 with an error message
  respondJSON(request, response, 404, responseJSON);
};

module.exports = {
  byKey,
  byRange,
  byLevel,
  byType,
  byAttribute,
  testRes,
  notFound,
};

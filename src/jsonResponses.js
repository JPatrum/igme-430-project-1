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

// TODO: Endpoint functions

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
    notFound,
}
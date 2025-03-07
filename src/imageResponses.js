const fs = require('fs');

const getImage = (request, response) => {
    const image = fs.readFileSync(`${__dirname}/../database/images/${request.query.imageName}`);
    response.writeHead(200, {'Content-Type': 'image/png'});
    response.write(image);
    response.end();
}

module.exports.getImage = getImage;
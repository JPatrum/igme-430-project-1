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

const concatResults = (uResults) => {
  const cResults = [];
  for (let i = 0; i < 500; i++) {
    if (uResults.length >= i) {
      return uResults;
    }

    cResults.push(uResults[i]);
  }
  return cResults;
};

const noResults = (request, response) => {
  const responseJSON = {};
  respondJSON(request, response, 204, responseJSON);
};

const badRequest = (request, response, issue) => {
  const responseJSON = {
    message: `There was an issue parsing your request: "${issue}"`,
    id: 'badRequest',
  };
  respondJSON(request, response, 400, responseJSON);
};

const postCard = (request, response) => {
  const params = request.body;
  const errMessage = "Missing required parameter."
  let newCard = {};

  if (!params.number) return badRequest(request, response, errMessage);
  if (!params.name) return badRequest(request, response, errMessage);
  if (!params.set) return badRequest(request, response, errMessage);
  if (!params.rarity) return badRequest(request, response, errMessage);
  if (!params.type) return badRequest(request, response, errMessage);
  if (!params.attribute) return badRequest(request, response, errMessage);

  if (!database.isNumberUnique(params.number)) {
    return respondJSON(request, response, 204, {});
  }

  newCard.Card_Name = params.name;
  newCard.Card_Number = params.number;
  newCard.Card_Set = params.set;
  newCard.Rarity = params.rarity;
  newCard.Card_Type = params.type;
  newCard.Attribute = params.attribute;

  // Placeholder
  newCard.Image_Name = "custom.png";

  /*
  TODO:
    Level
    ATK_DEF
    Property
    Pendulum_Scale
    Rank
    Link_Arrows
    ATK_LINK
  */

  if(params.type === 'Monster'){
    if(params.monsterTypes){
      newCard.Types = params.monsterTypes.join(' / ');
    }
    else{
      newCard.Types = "Normal";
    }

    // TODO: LVL/Rank, ATK/DEF/LINK, Arrows, Scale
  }

  // TODO: Spell & Trap cards w/ Property
  
}

const byKey = (request, response) => {
  const key = request.query.key;
  const responseJSON = {
    results: concatResults(database.getByKey(key)),
  };
  if (responseJSON.results.length === 0) {
    return noResults(request, response);
  }
  return respondJSON(request, response, 200, responseJSON);
};

const byRange = (request, response) => {
  const minATK = parseInt(request.query.minATK);
  const maxATK = parseInt(request.query.maxATK);
  const minDEF = parseInt(request.query.minDEF);
  const maxDEF = parseInt(request.query.maxDEF);
  if (maxATK < minATK || maxDEF < minDEF) {
    return badRequest(request, response, 'Maximum ATK/DEF must be greater than or equal to minimum ATK/DEF.');
  }
  if (minATK < 0 || maxATK < 0 || minDEF < 0 || maxDEF < 0) {
    return badRequest(request, response, 'ATK/DEF cannot be negative.');
  }
  const responseJSON = {
    results: concatResults(database.getByRange(minATK, maxATK, minDEF, maxDEF)),
  };
  if (responseJSON.results.length === 0) {
    return noResults(request, response);
  }
  return respondJSON(request, response, 200, responseJSON);
};

const byLevel = (request, response) => {
  const level = parseInt(request.query.level);
  console.log(level);
  if (level < 1 || level > 12) {
    return badRequest(request, response, 'Level/rank cannot fall below 1 or above 12');
  }
  const responseJSON = {
    results: concatResults(database.getByLevel(level)),
  };
  if (responseJSON.results.length === 0) {
    return noResults(request, response);
  }
  return respondJSON(request, response, 200, responseJSON);
};

const byType = (request, response) => {
  const type = request.query.type;
  const responseJSON = {
    results: concatResults(database.getByType(type)),
  };
  if (responseJSON.results.length === 0) {
    return noResults(request, response);
  }
  return respondJSON(request, response, 200, responseJSON);
};

const byAttribute = (request, response) => {
  const attribute = request.query.attribute;
  const responseJSON = {
    results: concatResults(database.getByAttribute(attribute)),
  };
  if (responseJSON.results.length === 0) {
    return noResults(request, response);
  }
  return respondJSON(request, response, 200, responseJSON);
};

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
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
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

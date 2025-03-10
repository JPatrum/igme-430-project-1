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

  if (params.type === 'Monster') {
    if (params.monsterTypes) {
      newCard.Types = params.monsterTypes.join(' / ');
    }
    else {
      newCard.Types = "Normal";
    }

    if (params.level) {
      const lvl = parseInt(params.level);
      const lvlErr = "Level/Rank must be within a min of 1 and a max of 12.";
      if (lvl < 1 || lvl > 12) return badRequest(request, response, lvlErr);

      if (newCard.Types.includes('Xyz')) {
        newCard.Rank = lvl;
        newCard.Level = '';
      } else {
        newCard.Level = lvl;
        newCard.Rank = '';
      }
    } else {
      if (newCard.Types.includes('Xyz')) {
        newCard.Rank = 1;
        newCard.Level = '';
      } else {
        newCard.Level = 1;
        newCard.Rank = '';
      }
    }

    const atkDef = [0, 0];
    const statsErr = "ATK/DEF cannot be negative."

    if (params.ATK) {
      atkDef[0] = parseInt(params.ATK);
      if (atkDef[0] < 0) return badRequest(request, response, statsErr);
    }
    if (params.DEF) {
      atkDef[1] = parseInt(params.DEF);
      if (atkDef[1] < 0) return badRequest(request, response, statsErr);
    }

    if (newCard.Types.includes('Link')) {
      if (!params.Link) {
        const linkErr = "Link-type cards must have at least one selected Link Arrow."
        return badRequest(request, response, linkErr);
      }
      atkDef[1] = parseInt(params.Link);
      newCard.ATK_DEF = '';
      newCard.ATK_LINK = atkDef.join(' / ');
      newCard.Link_Arrows = params.arrows.join(', ')
    } else {
      if (params.Link) {
        const arrowErr = "Non-Link cards cannot have selected Link Arrows."
        return badRequest(request, response, arrowErr);
      }
      newCard.ATK_LINK = '';
      newCard.Link_Arrows = '';
      newCard.ATK_DEF = atkDef.join(' / ');
    }

    if (params.scale) {
      newCard.Pendulum_Scale = parseInt(params.scale);
      if (newCard.Pendulum_Scale < 0 || newCard.Pendulum_Scale > 13) {
        const scaleErr = "Pendulum Scale cannot be negative or exceed 13.";
        return badRequest(request, response, scaleErr);
      }
    } else {
      newCard.Pendulum_Scale = '';
    }

    newCard.Property = '';
  }
  else {
    const valid = {
      'Spell': ['Normal', 'Continuous', 'Field', 'Quick-Play', 'Equip', 'Ritual'],
      'Trap': ['Normal', 'Continuous', 'Counter'],
    };

    if (valid[params.type].includes(params.property)) {
      newCard.Property = params.property;
    } else {
      newCard.Property = "Normal";
    }
  }

  database.addCard(newCard);
  const responseJSON = {
    message: "Card successfully added."
  }
  return respondJSON(request, response, 201, responseJSON);
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
  postCard,
  byKey,
  byRange,
  byLevel,
  byType,
  byAttribute,
  testRes,
  notFound,
};

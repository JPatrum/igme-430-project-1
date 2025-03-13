const db = require('../database/ygo_db.json');

/*
  Everything in this script handles interacting with the database
  This includes filtering (search), adding, and deleting cards
*/

// It'd be easy to export the database and have jsonResponses do this itself,
// but I prefer for the database to be separated from the rest of the API
const addCard = (card) => {
  db.push(card);
};

// Finds the card with the requested number and sends back the card's name if deletion is successful
const deleteCard = (number) => {
  for (let i = 0; i < db.length; i++) {
    const card = db[i];
    if (card.Card_Number === number) {
      db.splice(i, 1);
      return card.Card_Name;
    }
  }
  return false;
};

// Determines if a card with the given number already exists
const isNumberUnique = (testNum) => {
  for (let i = 0; i < db.length; i++) {
    const card = db[i];
    if (card.Card_Number === testNum) {
      return false;
    }
  }
  return true;
};

// Filter by keyword
const getByKey = (key) => {
  const r = [];

  for (let i = 0; i < db.length; i++) {
    const card = db[i];
    if (card.Card_Name.includes(key)) {
      r.push(card);
    }
  }

  return r;

  // There's a card in the db just named "7" that was accidentally read as an int instead of a string
  // Since this function uses string.includes, that one card caused this function to crash the API
};

// Filter by ATK/DEF range
const getByRange = (minATK, maxATK, minDEF, maxDEF) => {
  const r = [];

  for (let i = 0; i < db.length; i++) {
    const card = db[i];
    if (card.Card_Type === 'Monster') {
      const ATK_DEF = card.ATK_DEF.replace(/\s/g, '').split('/');
      const atk = parseInt(ATK_DEF[0], 10); // Specifying base 10 so ESLint doesn't yell at me
      const def = parseInt(ATK_DEF[1], 10);

      if (atk >= minATK && atk <= maxATK && def >= minDEF && def <= maxDEF) {
        r.push(card);
      }
    }
  }

  return r;
};

// Filter by level
const getByLevel = (lvl) => {
  const r = [];

  // We're only filtering by one value, so parseInt isn't actually needed
  for (let i = 0; i < db.length; i++) {
    const card = db[i];
    if (card.Card_Type === 'Monster') {
      if (card.Level === lvl || card.Rank === lvl) {
        r.push(card);
      }
    }
  }

  return r;
};

// Gets only monster cards with no effects, for use later
const getNonEffects = () => {
  const r = [];

  for (let i = 0; i < db.length; i++) {
    const card = db[i];
    if (card.Card_Type === 'Monster') {
      const cTypes = card.Types.replace(/\s/g, '').split('/');

      if (!cTypes.includes('Effect')) {
        r.push(card);
      }
    }
  }

  return r;
};

// Filter by monster type
const getByType = (type) => {
  if (type === 'NonEffect') {
    return getNonEffects();
  }

  const r = [];

  for (let i = 0; i < db.length; i++) {
    const card = db[i];
    const cTypes = card.Types.replace(/\s/g, '').split('/');

    if (cTypes.includes(type) || card.Type === type) {
      r.push(card);
    }
  }

  return r;
};

// Filter by attribute
const getByAttribute = (attribute) => {
  const r = [];

  for (let i = 0; i < db.length; i++) {
    const card = db[i];
    if (card.Card_Type === 'Monster') {
      if (card.Attribute === attribute) {
        r.push(card);
      }
    }
  }

  return r;
};

module.exports = {
  addCard,
  deleteCard,
  isNumberUnique,
  getByKey,
  getByRange,
  getByLevel,
  getByType,
  getByAttribute,
};

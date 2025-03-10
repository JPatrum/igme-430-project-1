const db = require('../database/ygo_db.json');

const isNumberUnique = (testNum) => {
  for(let i = 0; i < db.length; i++){
    const card = db[i];
    if(card.Card_Number === testNum){
      return false;
    }
  }
  return true;
}

const getByKey = (key) => {
  const r = [];

  for (let i = 0; i < db.length; i++) {
    const card = db[i];
    if (card.Card_Name.includes(key)) {
      r.push(card);
    }
  }

  return r;
};

const getByRange = (minATK, maxATK, minDEF, maxDEF) => {
  const r = [];

  for (let i = 0; i < db.length; i++) {
    const card = db[i];
    if (card.Card_Type !== 'Monster') {
      continue;
    }

    const ATK_DEF = card.ATK_DEF.replace(/\s/g, '').split('/');
    const atk = parseInt(ATK_DEF[0]);
    const def = parseInt(ATK_DEF[1]);

    if (atk >= minATK && atk <= maxATK && def >= minDEF && def <= maxDEF) {
      r.push(card);
    }
  }

  return r;
};

const getByLevel = (lvl) => {
  const r = [];

  for (let i = 0; i < db.length; i++) {
    const card = db[i];
    if (card.Card_Type !== 'Monster') {
      continue;
    }

    if (card.Level === lvl || card.Rank === lvl) {
      r.push(card);
    }
  }

  return r;
};

const getNonEffects = () => {
  const r = [];

  for (let i = 0; i < db.length; i++) {
    const card = db[i];
    if (card.Card_Type !== 'Monster') {
      continue;
    }

    const cTypes = card.Types.replace(/\s/g, '').split('/');

    if (!cTypes.includes('Effect')) {
      r.push(card);
    }
  }

  return r;
};

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

const getByAttribute = (attribute) => {
  const r = [];

  for (let i = 0; i < db.length; i++) {
    const card = db[i];
    if (card.Card_Type !== 'Monster') {
      continue;
    }

    if (card.Attribute === attribute) {
      r.push(card);
    }
  }

  return r;
};

module.exports = {
  db,
  isNumberUnique,
  getByKey,
  getByRange,
  getByLevel,
  getByType,
  getByAttribute,
};

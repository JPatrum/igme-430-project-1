const db = require('../database/ygo_db.json');

const getByKey = (key) => {
  let r = [];

  for(let card of db){
    if(card.Card_Name.includes(key)){
      r.push(card);
    }
  }

  return r;
}

const getByRange = (minATK, maxATK, minDEF, maxDEF) => {
  let r = [];

  for(let card of db){
    if(card.Card_Type !== "Monster"){
      continue;
    }

    let ATK_DEF = card.ATK_DEF.replace(/\s/g, '').split('/');
    let atk = parseInt(ATK_DEF[0]);
    let def = parseInt(ATK_DEF[1]);

    if(atk >= minATK && atk <= maxATK && def >= minDEF && def <= maxDEF){
      r.push(card);
    }
  }

  return r;
}

const getByLevel = (lvl) => {
  let r = [];

  for(let card of db){
    if(card.Card_Type !== "Monster"){
      continue;
    }

    if(card.Level === lvl || card.Rank === lvl){
      r.push(card);
    }
  }

  return r;
}

const getNonEffects = () => {
  let r = [];

  for(let card of db){
    if(card.Card_Type !== "Monster"){
      continue;
    }

    let cTypes = card.Types.replace(/\s/g, '').split('/');

    if(!cTypes.includes("Effect")){
      r.push(card);
    }
  }

  return r;
}

const getByType = (type) => {
  if(type === "NonEffect"){
    return getNonEffects();
  }


  let r = [];

  for(let card of db){
    let cTypes = card.Types.replace(/\s/g, '').split('/');

    if(cTypes.includes(type) || card.Type === type){
      r.push(card);
    }
  }

  return r;
}

const getByAttribute = (attribute) => {
  let r = [];

  for(let card of db){
    if(card.Card_Type !== "Monster"){
      continue;
    }

    if(card.Attribute === attribute){
      r.push(card);
    }
  }

  return r;
}

module.exports = {
  db,
  getByKey,
  getByRange,
  getByLevel,
  getByType,
  getByAttribute,
};

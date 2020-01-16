const mongoose = require("mongoose")
const consola = require("consola")
const fs = require("fs")

const Club = mongoose.model("Club")
const Season = mongoose.model("Season")
const Player = mongoose.model("Player")
const Competition = mongoose.model("Competition")

const addClub = clubObj => {
  return new Promise((resolve, reject) => {
    const club = new Club()
    club.title = clubObj.title
    club.shorthand = clubObj.shorthand
    club.description = clubObj.description
    club.logo = clubObj.logo
    club.save((err, product) => {
      consola.error(err)
      if (err) reject(err)
      else resolve(product)
    })
  })
}

const addSeason = seasonObj => {
  return new Promise((resolve, reject) => {
    const season = new Season()
    season.title = seasonObj.title
    season.timelines = {
      start: Date.now(),
      end: Date.now()
    }
    season.competitions = seasonObj.competitions
    season.status = seasonObj.status
    season.save((err, product) => {
      if (err) reject(err)
      else resolve(product)
    })
  })
}

const addCompetition = compObj => {
  return new Promise((resolve, reject) => {
    const competition = new Competition()
    competition.title = compObj.title
    competition.timelines = {
      start: Date.now(),
      end: Date.now()
    }
    competition.season = compObj.season
    competition.fixtures = compObj.fixtures
    competition.status = compObj.status
    competition.save((err, product) => {
      if (err) reject(err)
      else resolve(product)
    })
  })
}

const addPlayer = playerObj => {
  return new Promise((resolve, reject) => {
    const player = new Player()
    player.firstName = playerObj.firstName
    player.lastName = playerObj.lastName
    player.fullname = playerObj.fullname
    player.email = playerObj.email
    player.social = playerObj.social
    player.seasons = playerObj.seasons
    player.availability = playerObj.availability
    player.save((err, product) => {
      if (err) reject(err)
      else resolve(product)
    })
  })
}

const parseJSON = JSONfile => {
  const rawdata = fs.readFileSync(JSONfile)
  const data = JSON.parse(rawdata)
  return data
}

const seedFactory = async (dataJSON, promiseFunction, seedName) => {
  const seedObj = parseJSON(dataJSON)
  const promises = seedObj.map(seed => promiseFunction(seed))
  const seedResult = await Promise.all(promises)
  consola.success(`Seeded ${seedResult.length} ${seedName}`)
}

const seedClubs = () => {
  seedFactory("server/seeder/clubSeeds.json", addClub, "clubs")
}

const seedPlayers = () => {
  seedFactory("server/seeder/playerSeeds.json", addPlayer, "players")
}

const seedSeasons = () => {
  seedFactory("server/seeder/seasonSeeds.json", addSeason, "seasons")
}

const seedCompetitions = () => {
  seedFactory(
    "server/seeder/competitionSeeds.json",
    addCompetition,
    "competitions"
  )
}

// Uses a provided function to seed data into the specified collection
const seedDB = async (dbconnection, collectionName, factory) => {
  let collection = dbconnection.collection(collectionName)
  if (collection.collection == null)
    collection = await dbconnection.createCollection(collectionName)

  collection.countDocuments("", (err, count) => {
    if (err)
      consola.error(`Error getting ${collectionName} collection count: ${err}`)
    else if (count === 0) {
      consola.info(`Seeding ${collectionName} collection`)
      factory()
    }
  })
}

module.exports = {
  addClub,
  seedFactory,
  seedClubs,
  seedPlayers,
  seedSeasons,
  seedCompetitions,
  seedDB
}
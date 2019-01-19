const { Connection, Request } = require('tedious')
const tp = require('tedious-promises')

// Database setup
const config = {
  userName: 'cambridge-hack-18',
  password: 'AnsonGodCarry!',
  server: 'cambridge-hack-18.database.windows.net',
  options: {
    database: 'cambridge-hack',
    encrypt: true
  }
}

class Database {

  constructor() {
    tp.setConnectionConfig(config)
    this.conn = new Connection(config)
    console.log('connecting to db')
  }

  async getQuestion() {
    try{
      return await tp.sql(`SELECT * FROM Questions`).execute()
    }catch (e) {
      console.log(e);   // uncaught
  }
  }
  async getResponse(id) {
    try{
      return await tp.sql(`SELECT keywords, frequency FROM Responses WHERE QuestionId = ${id}`).execute()
    }catch (e) {
      console.log(e);   // uncaught
}}
}

var instance = null
function getInstance() {
  if (instance == null) instance = new Database()
  return instance
}

module.exports = {
  getInstance: getInstance
}
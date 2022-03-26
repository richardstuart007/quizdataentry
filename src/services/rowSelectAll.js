//
//  Utilities
//
import apiAxios from './apiAxios'
//
// Constants
//
const sqlClient = 'Quiz/rowSelectAll'
const { URL_BASE } = require('./constants.js')
const { URL_QUESTIONS } = require('./constants.js')
const { SQL_TABLE } = require('./constants.js')
//
//  Debug logging
//
let g_log1 = true
//===================================================================================
async function rowSelectAll() {
  //
  //  Database Update
  //
  const updateDatabase = async () => {
    try {
      //
      //  Setup actions
      //
      const method = 'post'
      const sqlWhere = `qid > 0 `
      const body = {
        sqlClient: sqlClient,
        sqlTable: SQL_TABLE,
        sqlAction: 'SELECT',
        sqlWhere: sqlWhere
      }
      const URL = URL_BASE + URL_QUESTIONS
      if (g_log1) console.log('URL ', URL)
      //
      //  SQL database
      //
      const resultData = await apiAxios(method, URL, body)
      if (g_log1) console.log('data returned ', resultData)
      //
      // Data
      //
      return resultData
      //
      // Errors
      //
    } catch (err) {
      console.log(err.message)
      return null
    }
  }
  //--------------------------------------------------------------------
  //-  Main Line
  //--------------------------------------------------------------------
  if (g_log1) console.log('Start rowSelectAll')
  //
  // Database Update
  //
  const promise = updateDatabase()
  //
  // Return promise
  //
  if (g_log1) console.log('Return promise', promise)
  return promise
}

export default rowSelectAll

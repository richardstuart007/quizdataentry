//
//  Utilities
//
import rowUpsert from './rowUpsert'
import rowUpdate from './rowUpdate'
import rowDelete from './rowDelete'
import rowSelectAll from './rowSelectAll'
import MyQueryPromise from './MyQueryPromise'
//
//  Local Storage Keys
//
const KEYS = {
  ROW: 'questions_ROW',
  QID: 'questions_QID'
}
//
//  Debug logging
//
let g_log1 = true
//.............................................................................
//.  INSERT
//.............................................................................
export function insertRow(data) {
  //
  //  Data Received
  //
  if (g_log1) console.log('Upsert Row ', data)
  //
  //  Strip out qid as it will be populated by Insert
  //
  let { qid, ...rowData } = data
  if (g_log1) console.log('Upsert Database rowData ', rowData)
  //
  //  Process promise
  //
  if (g_log1) console.log('rowUpsert')
  var myPromise = MyQueryPromise(rowUpsert(rowData))
  //
  //  Initial status
  //
  if (g_log1) console.log('Initial pending:', myPromise.isPending()) //true
  if (g_log1) console.log('Initial fulfilled:', myPromise.isFulfilled()) //false
  if (g_log1) console.log('Initial rejected:', myPromise.isRejected()) //false
  //
  //  Resolve Status
  //
  myPromise.then(function (data) {
    if (g_log1) console.log('myPromise ', myPromise)
    if (g_log1) console.log('Final fulfilled:', myPromise.isFulfilled()) //true
    if (g_log1) console.log('Final rejected:', myPromise.isRejected()) //false
    if (g_log1) console.log('Final pending:', myPromise.isPending()) //false
    if (g_log1) console.log('data ', data)
    //
    //  No data
    //
    if (!data) {
      console.log('No Data returned')
      throw Error
    } else {
      //
      //  Get ID
      //
      const rtn_qid = data[0].qid
      if (g_log1) console.log(`Row (${rtn_qid}) UPSERTED in Database`)
    }
  })
}
//.............................................................................
//.  UPDATE
//.............................................................................
export function updateRow(data) {
  //
  //  Data Received
  //
  if (g_log1) console.log('updateRow Row ', data)
  //
  //  Process promise
  //
  if (g_log1) console.log('rowUpsert')
  var myPromise = MyQueryPromise(rowUpdate(data))
  //
  //  Initial status
  //
  if (g_log1) console.log('Initial pending:', myPromise.isPending()) //true
  if (g_log1) console.log('Initial fulfilled:', myPromise.isFulfilled()) //false
  if (g_log1) console.log('Initial rejected:', myPromise.isRejected()) //false
  //
  //  Resolve Status
  //
  myPromise.then(function (data) {
    if (g_log1) console.log('myPromise ', myPromise)
    if (g_log1) console.log('Final fulfilled:', myPromise.isFulfilled()) //true
    if (g_log1) console.log('Final rejected:', myPromise.isRejected()) //false
    if (g_log1) console.log('Final pending:', myPromise.isPending()) //false
    if (g_log1) console.log('data ', data)
    //
    //  No data
    //
    if (!data) {
      console.log('No Data returned')
      throw Error
    } else {
      //
      //  Get QID
      //
      const rtn_qid = data[0].qid
      if (g_log1) console.log(`Row (${rtn_qid}) UPDATED in Database`)
    }
  })
  //
  //  Local Storage
  //
  let database = getRowAll()
  let recordIndex = database.findIndex(x => x.qid === data.qid)
  database[recordIndex] = { ...data }
  localStorage.setItem(KEYS.ROW, JSON.stringify(database))
}
//.............................................................................
//.  DELETE
//.............................................................................
export function deleteRow(qid) {
  //
  //  Data Received
  //
  if (g_log1) console.log('rowDelete', qid)
  //
  //  Process promise
  //
  if (g_log1) console.log('rowDelete')
  var myPromise = MyQueryPromise(rowDelete(qid))
  //
  //  Initial status
  //
  if (g_log1) console.log('Initial pending:', myPromise.isPending()) //true
  if (g_log1) console.log('Initial fulfilled:', myPromise.isFulfilled()) //false
  if (g_log1) console.log('Initial rejected:', myPromise.isRejected()) //false
  //
  //  Resolve Status
  //
  myPromise.then(function (data) {
    if (g_log1) console.log('myPromise ', myPromise)
    if (g_log1) console.log('Final fulfilled:', myPromise.isFulfilled()) //true
    if (g_log1) console.log('Final rejected:', myPromise.isRejected()) //false
    if (g_log1) console.log('Final pending:', myPromise.isPending()) //false
    if (g_log1) console.log('data ', data)
    //
    //  No data
    //
    if (!data) {
      console.log('No Data returned')
      throw Error
    } else {
      //
      //  Get QID
      //
      const rtn_qid = data[0].qid
      if (g_log1) console.log(`Row (${rtn_qid}) DELETED in Database`)
    }
  })
}
//.............................................................................
//.  GET ALL
//.............................................................................
export function getRowAll() {
  //
  //  Process promise
  //
  if (g_log1) console.log('rowSelectAll')
  var myPromise = rowSelectAll()
  //
  //  Resolve Status
  //
  myPromise.then(function (data) {
    if (g_log1) console.log('myPromise ', myPromise)
    if (g_log1) console.log('data ', data)
    //
    //  No data
    //
    if (!data) {
      console.log('No Data returned')
      return []
    }
    //
    //  Get Count
    //
    const rtn_length = data.length
    if (g_log1) console.log(`Rows (${rtn_length}) SELECTED in Database`)
    return data
  })

  return myPromise
}

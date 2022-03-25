//
//  Local Storage Keys
//
const KEYS = {
  ROW: 'questions_ROW',
  ID: 'questions_ID'
}

export function insertRow(data) {
  let row = getRowAll()
  data['id'] = generate_ID()
  row.push(data)
  localStorage.setItem(KEYS.ROW, JSON.stringify(row))
}

export function updateRow(data) {
  let row = getRowAll()
  let recordIndex = row.findIndex(x => x.id === data.id)
  row[recordIndex] = { ...data }
  localStorage.setItem(KEYS.ROW, JSON.stringify(row))
}

export function deleteRow(id) {
  let row = getRowAll()
  row = row.filter(x => x.id !== id)
  localStorage.setItem(KEYS.ROW, JSON.stringify(row))
}
//
//  Generate next ID
//
export function generate_ID() {
  //.  If no ID then store 0
  if (localStorage.getItem(KEYS.ID) === null) localStorage.setItem(KEYS.ID, '0')
  //.  Get Store value
  var id = parseInt(localStorage.getItem(KEYS.ID))
  //.  Increment ID by 1 and store
  localStorage.setItem(KEYS.ID, (++id).toString())
  return id
}

export function getRowAll() {
  if (localStorage.getItem(KEYS.ROW) === null)
    localStorage.setItem(KEYS.ROW, JSON.stringify([]))
  let row = JSON.parse(localStorage.getItem(KEYS.ROW))
  return row
}
